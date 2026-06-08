import { useState } from 'react';
import { useAlert } from '../utils/useAlert';
import { formatRelativeTime } from '../utils/time';
import { useCommentsByTaskId, useCreateComment } from '../hooks/useComments';

import { Button, Divider, Input, Typography } from 'antd';
import { FaRegUser, FaRegChessKing, FaRegComments } from "react-icons/fa6";
import { LuBriefcase, LuSendHorizontal } from "react-icons/lu";

const { Text } = Typography;
const { Search } = Input;

const GetRoleIcon = ({role}) => {
    switch(role.toLowerCase()){
        case "admin":
            return <FaRegChessKing />;
        case "customer":
            return <LuBriefcase />;
        case "member":
            return <FaRegUser />;
        default:
            return <span></span>;
    }
};


export const Comments = ({ taskId }) => {
    const [comment, setComment] = useState("");

    const { alertComponent, showAlert } = useAlert();

    const { data, isLoading, isError, error } = useCommentsByTaskId(taskId);

    const { mutate, isPending } = useCreateComment({
        showAlert,
        clear: () => setComment("")
    });

    const handleComment = (value) => {
        const cleanedComment = value?.trim().replace(/\s+/g, " ");

        if(!cleanedComment) {
            setComment("");
            return;
        };

        mutate({
            comment_message: cleanedComment,
            comment_task_id: taskId
        });
    };

    return (
        <div className='pb-4'>
            {alertComponent}

            {/*====== Divider ======*/}
            <Divider>
                <Text className='flex items-center gap-2' disabled>
                    <FaRegComments className='text-lg' />
                    <span>Comments</span>
                </Text>
            </Divider>

            {/*====== Comments ======*/}
            {isLoading ? (
                <div className="flex justify-center py-5">
                    <Text type="secondary">Loading comments...</Text>
                </div>
            ) : isError ? (
                <div className="flex justify-center py-5">
                    <Text type="danger">
                        {error?.message || "Failed to load comments"}
                    </Text>
                </div>
            ) : data?.length === 0 ? (
                <div className="flex justify-center pb-5">
                    <Text disabled>No comments yet</Text>
                </div>
            ) : (
                <ul className="flex flex-col gap-6 mb-5 max-h-50 overflow-y-auto">
                    {data?.map((comment) => {
                        const { comment_id, user_name, user_role, comment_message, comment_created_at } = comment;

                        return (
                            <li key={comment_id} className="grid grid-cols-[auto_1fr] items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center">
                                    <GetRoleIcon role={user_role}/>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium text-gray-800 leading-tight">{user_name}</h4>
                                        <span className="text-xs text-gray-500">{formatRelativeTime(comment_created_at)}</span>
                                    </div>
                                        
                                    <p className="text-[13px] text-gray-600 leading-5 max-w-2xl">{comment_message}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}

            {/*====== Input Field ======*/}
            <Search 
                placeholder="Write comments..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onSearch={handleComment} 
                enterButton={<LuSendHorizontal />} 
                allowClear
                disabled={isPending}
            />
        </div>
    )
};