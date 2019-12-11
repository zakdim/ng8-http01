import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content };
        // console.log(`create post ${JSON.stringify(postData)}`);
        this.http
            .post<{ name: string }>(
                'https://ng-complete-guide-36ecd.firebaseio.com/posts.json',
                postData
            )
            .subscribe(responseData => {
                console.log(responseData);
            });
    }

    fetchPosts() {
        return this.http
            .get<{ [key: string]: Post }>('https://ng-complete-guide-36ecd.firebaseio.com/posts.json')
            .pipe(map(responseData => {
                const postsArray: Post[] = [];
                for (let key in responseData) {
                    if (responseData.hasOwnProperty(key)) {
                        postsArray.push({ ...responseData[key], id: key });
                    }
                }
                return postsArray;
            })
        );
    }
}