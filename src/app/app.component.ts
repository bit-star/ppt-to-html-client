import {Component, OnInit, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {Title} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material';
import {environment} from '../environments/environment';

declare var dd: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class AppComponent   implements OnInit ,AfterViewInit  {

  images: string[] = [];
  color = 'primary';
  msg = '';
  // mode = 'determinate';
  mode = 'indeterminate';
  value = 50;
  title:string;

  constructor(private http: HttpClient, private ref: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private titleService: Title) {
  }



  ngAfterViewInit(): void {
    let that = this;
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        const meetingFileId = params['meetingFileId'];
        if (meetingFileId) {
          dd.ready(function () {
            dd.runtime.permission.requestAuthCode({
              corpId: environment.corpId,
              onSuccess: function (info) {


                let IMAGE_URL = '/api/dingtalk/generation/imageList?code='+info.code+'&corpid='+environment.corpId+'&meetingFileId='+meetingFileId;
                let xhr = new XMLHttpRequest(); // (1)
                xhr.open("GET", IMAGE_URL); // (2)
                xhr.onreadystatechange = () => { // (3)
                  if (xhr.readyState == 4 ) { // (4)
                    if(xhr.status == 200){
                      if (xhr.responseText) {
                        try {
                          const data = JSON.parse(xhr.responseText); // (5)
                          console.log('success fetch images:',data);
                          that.images = data.urls;
                          that.title=data.title;
                          dd.biz.navigation.setTitle({
                            title : data.title,//控制标题文本，空字符串表示显示默认文本
                            onSuccess : function(result) {
                              /*结构
                              {
                              }*/
                            },
                            onFail : function(err) {
                              console.error('设置标题时出错 '+ JSON.stringify(err));
                            }
                          });
                          // console.log(that.title,that.titleService.getTitle());
                          that.mode='determinate'
                          that.ref.markForCheck();
                          that.ref.detectChanges();
                        } catch (error) {
                          that.mode='determinate'
                          that.msg='很抱歉，资源没找到。'
                          console.error('获取图片数据时出错 '+ JSON.stringify(error));
                          that.ref.markForCheck();
                          that.ref.detectChanges();
                        }
                      }
                    }else{
                      that.mode='determinate'
                      that.msg='很抱歉，资源没找到。'
                      console.error('获取图片数据时出错 ');
                      that.ref.markForCheck();
                      that.ref.detectChanges();
                    }

                  }
                };
                xhr.send(null); // (6)



                // console.log('code:'+JSON.stringify(info))
                // const httpOptions = {
                //   params: {
                //     code: info.code,
                //     corpid: environment.corpId,
                //     meetingFileId: meetingFileId
                //   }
                // };
                // that.http.get('/api/dingtalk/generation/imageList',httpOptions).subscribe((data:any) => {
                //     console.log('success fetch images:',data);
                //     that.images = data.urls;
                //     that.title=data.title;
                //     dd.biz.navigation.setTitle({
                //       title : data.title,//控制标题文本，空字符串表示显示默认文本
                //       onSuccess : function(result) {
                //         /*结构
                //         {
                //         }*/
                //       },
                //       onFail : function(err) {
                //         console.error('设置标题时出错 '+ JSON.stringify(err));
                //       }
                //     });
                //     // console.log(that.title,that.titleService.getTitle());
                //     that.mode='determinate'
                //     that.ref.markForCheck();
                //     that.ref.detectChanges();
                //   },
                //   error => {
                //     that.mode='determinate'
                //     that.msg='很抱歉，资源没找到。'
                //     console.error('获取图片数据时出错 '+ JSON.stringify(error));
                //     that.ref.markForCheck();
                //     that.ref.detectChanges();
                //   },
                //   () => console.log('HTTP Observable2 completed...'));
              },
              onFail: function (err) {
                console.error('获取认证Code失败: ' + JSON.stringify(err));
                that.mode='determinate'
                that.msg='获取认证Code失败'
              }
            });
          });
          dd.error(function (err) {
            console.error('钉钉 jssdk 错误回调: ' + JSON.stringify(err));
            that.mode='determinate'
            that.msg='钉钉 jssdk 错误回调'
          });
        }
      },
      error => {
        console.error('订阅路由参数时出错 '+ JSON.stringify(error));
        that.mode='determinate'
        that.msg='订阅路由参数时出错'
      },
      () => console.log('订阅路由参数完成...'));
  }



  getImages(code,meetingFileId) {

  }
  members:any
  ngOnInit() {
    // this.getMembers();
  }

  previewImage(event, image) {
    event.preventDefault();
    event.stopPropagation();
    console.log(this.titleService.getTitle())
    let that = this;
    dd.ready(function () {
      dd.biz.util.previewImage({
        urls: that.images,//图片地址列表
        current: image,//当前显示的图片链接
        onSuccess: function (result) {
          /**/
          console.log('preview success', result);
        },
        onFail: function (err) {
          console.log('preview fail', err);
        }
      });
    });
  }

}
