import CommentPage from "./commentPage";
import User from "./user";

export default interface Post {
    id: string;
    title: string;
    body: string;
    user: User;
    comments: CommentPage;
}
function start(){
    
}