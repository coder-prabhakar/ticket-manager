export const stylesFnForModal = info => {
    if (info.props.footer) {
        return {
            container: { borderRadius: 14, padding: 0, overflow: 'hidden' },
            body: { padding: 0 },
        };
    }
    return {};
};


export const stylesFnForTable = info => {
    if (info?.props?.size === 'medium') {
        return {
            root: {
                borderRadius: 8,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            },
            title: {
                backgroundImage: 'linear-gradient(90deg, #6a5acd, #836fff)',
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 600,
                padding: '12px 16px',
            },
            header: {
                cell: {
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#b8bdfd',
                    padding: '16px 16px',
                },
            },
            body: {
                cell: {
                    padding: '10px 16px',
                }
            },
            pagination: {
                root: { padding: '0 10px' },
                item: { color: '#b8bdfd' },
            },
        };
    }
    return {};
};