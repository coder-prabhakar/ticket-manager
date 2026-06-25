import sql from 'mssql';
import axios from 'axios';
import cron from 'node-cron';

// Pre-compiled parameters ko Meta format JSON objects me convert karna
function mapParamsToMetaFormat(paramsArray) {
    return paramsArray.map(param => {
        const cleanParam = param ? String(param).trim() : 'N/A';
        return { type: "text", text: cleanParam };
    });
}

// Meta API Dispatcher
async function sendMetaWhatsAppMessage(toPhone, templateName, paramsArray) {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const apiVersion = process.env.META_VERSION || 'v20.0';

    if (!accessToken || !phoneNumberId) {
        throw new Error('Meta API credentials are missing in .env file.');
    }

    let cleanPhone = toPhone.replace(/\D/g, ''); 
    if (cleanPhone.length === 10) { cleanPhone = '91' + cleanPhone; }

    const formattedComponents = [
        { type: "body", parameters: mapParamsToMetaFormat(paramsArray) }
    ];

    const metaUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "template",
        template: {
            name: templateName,
            language: { code: "en_US" },
            components: formattedComponents
        }
    };

    try {
        await axios.post(metaUrl, payload, {
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        const metaErrorDetail = error.response?.data?.error || {};
        throw new Error(`Code ${metaErrorDetail.code}: ${metaErrorDetail.message || error.message}`);
    }
}

// Background Worker
async function processWhatsappOutbox() {
    try {
        const pool = await sql.connect();
        
        // SP Execute karke verified records fetch kiye
        const result = await pool.request().execute('sp_get_pending_whatsapp_notifications');
        const pendingRecords = result.recordset;

        if (pendingRecords.length === 0) return;

        for (const record of pendingRecords) {
            try {
                const templateParamsArray = JSON.parse(record.template_params || '[]');
                
                const phoneNumbers = record.target_phones ? record.target_phones.split(',') : [];

                let dispatchPromises = phoneNumbers.map(phone => 
                    sendMetaWhatsAppMessage(phone, record.template_name, templateParamsArray)
                );

                if (dispatchPromises.length > 0) {
                    await Promise.all(dispatchPromises);
                }

                // Success Update via SP
                await pool.request()
                    .input('id', sql.Int, record.id)
                    .input('status', sql.VarChar(20), 'sent')
                    .execute('sp_update_whatsapp_notification_status');

            } catch (apiError) {
                console.error(`[WhatsApp API Error] Record ID ${record.id}:`, apiError.message);
                
                // Failure/Retry Update via SP
                await pool.request()
                    .input('id', sql.Int, record.id)
                    .input('status', sql.VarChar(20), 'failed')
                    .input('error_message', sql.NVarChar, apiError.message)
                    .execute('sp_update_whatsapp_notification_status');
            }
        }
    } catch (dbError) {
        console.error('[WhatsApp Worker SP Critical Error]:', dbError.message);
    }
}

// Execution Frequency: Polling every 15 seconds
cron.schedule('*/15 * * * * *', () => {
    processWhatsappOutbox();
});

console.log('🚀 Optimized Enterprise WhatsApp Worker Armed & Initialized via Stored Procedures...');