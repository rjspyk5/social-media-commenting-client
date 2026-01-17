export interface CommentType {
    _id: string;
    author: { _id: string, name: string };
    text: string;
    dislikesCount: number;
    likesCount: number;
    likes: string[];
    dislikes: string[];
    createdAt: string;
}

