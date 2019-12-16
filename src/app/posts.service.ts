import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { Post } from './post.model';
import { Subject, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) { }

    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content };
        // console.log(`create post ${JSON.stringify(postData)}`);
        this.http
            .post<{ name: string }>(
                'https://ng-complete-guide-36ecd.firebaseio.com/posts.json',
                postData
            )
            .subscribe(
                responseData => {
                    console.log(responseData);
                }, 
                error => {
                    this.error.next(error.message);
                }
            );
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key');
        return this.http
            .get<{ [key: string]: Post }>(
                'https://ng-complete-guide-36ecd.firebaseio.com/posts.json',
                {
                    headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
                    params: searchParams
                }
            )
            .pipe(
                map(responseData => {
                    const postsArray: Post[] = [];
                    for (let key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({ ...responseData[key], id: key });
                        }
                    }
                    return postsArray;
                }),
                catchError(errorRes => {
                    // Send to analytics server
                    return throwError(errorRes);
                })
            );
    }

    deletePosts() {
        return this.http.delete('https://ng-complete-guide-36ecd.firebaseio.com/posts.json');
        // this.fetchPosts().subscribe(posts => {
        //     posts.forEach(post => {
        //         const apiUrl = `https://ng-complete-guide-36ecd.firebaseio.com/posts/${post.id}.json`;
        //         console.log(`removing ${apiUrl}`);
        //         this.http.delete(apiUrl)
        //             .subscribe(result => {
        //                 // console.log(`removed: ${result}`);
        //             });
        //     });
        // });
    }
}