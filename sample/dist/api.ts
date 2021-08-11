import axios from "axios"
import qs from "qs"

export class Question{
          name: string| undefined
examId: number| undefined
num: number| undefined
question: string| undefined
a: string| undefined
b: string| undefined
c: string| undefined
d: string| undefined
answer: string| undefined
answer_key: string| undefined

      }


let instance = axios.create();

instance.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token')
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.oxoxauth = token  //请求头加上token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    });

// instance.interceptors.response.use(
//     res => {
//      return res.data.data
//   },
//   err=>{
//     return Promise.reject(err)
//   }
// );

export class Api {
    private static api: Api
    constructor() {

    }
    static getApi() {
        if (!Api.api) {
            Api.api = new Api()
        }
        return Api.api;
    }

    getBaseUrl() {
        return "http://" + window.location.hostname + ":3001"
    }

    getApidoc() {
        return this.getBaseUrl() + "/apidoc/index.html"
    }


    get(url: string, postData: any) {
        return instance.get(url + "?" + qs.stringify(postData)).then(s => {
            return s.data
        });
    }


    post(url: string, postData: any) {
        return instance.post(url, qs.stringify(postData)).then(s => {
            return s.data
        });
    }

    put(url: string, postData: any) {
        return instance.put(url, qs.stringify(postData)).then(s => {
            return s.data
        });
    }
    delete(url: string, postData: any) {
        return instance.delete(url + "?" + qs.stringify(postData)).then(s => {
            return s.data
        });
    }
    
  checkCode(account: string, code: string) {
    let postData: any = {};
    postData.account = account;
    postData.code = code;
    return this.post(this.getBaseUrl() + `/account/check_code`, postData);
}
  getUserInfo() {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/account/my`, postData);
}
  login(account: string, password: string) {
    let postData: any = {};
    postData.account = account;
    postData.password = password;
    return this.post(this.getBaseUrl() + `/account/login`, postData);
}
  putUserInfo(mail: string, headPath: string, language: string) {
    let postData: any = {};
    postData.mail = mail;
    postData.head_path = headPath;
    postData.language = language;
    return this.put(this.getBaseUrl() + `/account/my`, postData);
}
  register(account: string, password: string, userName: string, trueName: string, code: string) {
    let postData: any = {};
    postData.account = account;
    postData.password = password;
    postData.user_name = userName;
    postData.true_name = trueName;
    postData.code = code;
    return this.post(this.getBaseUrl() + `/account/register`, postData);
}
  resetPassword(mail: string, time: string, sign: string, password: string) {
    let postData: any = {};
    postData.mail = mail;
    postData.time = time;
    postData.sign = sign;
    postData.password = password;
    return this.put(this.getBaseUrl() + `/account/reset_password`, postData);
}
  resetPasswordByMail(mail: string, resetCode: string) {
    let postData: any = {};
    postData.mail = mail;
    postData.reset_code = resetCode;
    return this.post(this.getBaseUrl() + `/account/reset_password_by_mail`, postData);
}
  sendVerifyCode(account: string) {
    let postData: any = {};
    postData.account = account;
    return this.post(this.getBaseUrl() + `/account/send_verify_code`, postData);
}
  deletePrivileges(id: number) {
    let postData: any = {};
    return this.delete(this.getBaseUrl() + `/admin/privileges/${id}`, postData);
}
  deleteRoles(id: string) {
    let postData: any = {};
    return this.delete(this.getBaseUrl() + `/admin/roles/${id}`, postData);
}
  getPrivilege() {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/admin/privileges`, postData);
}
  getRole(id: string) {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/admin/roles/${id}`, postData);
}
  getRoles() {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/admin/roles`, postData);
}
  postPrivilege(name: string) {
    let postData: any = {};
    postData.name = name;
    return this.post(this.getBaseUrl() + `/admin/privileges`, postData);
}
  postRole(name: string) {
    let postData: any = {};
    postData.name = name;
    return this.post(this.getBaseUrl() + `/admin/roles`, postData);
}
  putPrivileges(id: number, name: string | null) {
    let postData: any = {};
    postData.name = name;
    return this.put(this.getBaseUrl() + `/admin/privileges/${id}`, postData);
}
  putRoles(name: string | null, privs: number[] | null) {
    let postData: any = {};
    postData.name = name;
    postData.privs = privs;
    return this.put(this.getBaseUrl() + `/admin/roles`, postData);
}
  deleteArticle(id: number) {
    let postData: any = {};
    return this.delete(this.getBaseUrl() + `/articles/${id}`, postData);
}
  getArticle(id: number) {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/articles/${id}`, postData);
}
  getArticles(title: string | null, content: string | null, tags: string) {
    let postData: any = {};
    postData.title = title;
    postData.content = content;
    postData.tags = tags;
    return this.get(this.getBaseUrl() + `/articles/`, postData);
}
  putArticle(id: number, title: string, content: string, tags: string) {
    let postData: any = {};
    postData.id = id;
    postData.title = title;
    postData.content = content;
    postData.tags = tags;
    return this.put(this.getBaseUrl() + `/articles/`, postData);
}
  uploadArticle(title: string, content: string, tags: string) {
    let postData: any = {};
    postData.title = title;
    postData.content = content;
    postData.tags = tags;
    return this.post(this.getBaseUrl() + `/articles/`, postData);
}
  botHelp(type: string) {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/bot/help/${type}`, postData);
}
  getBot(id: number) {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/bot/bots/${id}`, postData);
}
  getBotList() {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/bot/bots`, postData);
}
  getGroup(id: number) {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/bot/groups/${id}`, postData);
}
  getGroupList(id: number) {
    let postData: any = {};
    postData.id = id;
    return this.get(this.getBaseUrl() + `/bot/groups`, postData);
}
  setBotHead(id: number, imgurl: string) {
    let postData: any = {};
    postData.imgurl = imgurl;
    return this.put(this.getBaseUrl() + `/bot/bots/${id}/head_url`, postData);
}
  debug() {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/debug`, postData);
}
  debugput(test: string) {
    let postData: any = {};
    postData.test = test;
    return this.put(this.getBaseUrl() + `/debug`, postData);
}
  deleteExam(id: number) {
    let postData: any = {};
    return this.delete(this.getBaseUrl() + `/exams/${id}`, postData);
}
  getExam(id: number) {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/exams/${id}`, postData);
}
  getExams() {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/exams`, postData);
}
  postExam(name: string) {
    let postData: any = {};
    postData.name = name;
    return this.post(this.getBaseUrl() + `/exams`, postData);
}
  putExam(id: string, name: string | null) {
    let postData: any = {};
    postData.name = name;
    return this.put(this.getBaseUrl() + `/exams/${id}`, postData);
}
  cheakUpdate(name: string) {
    let postData: any = {};
    postData.name = name;
    return this.post(this.getBaseUrl() + `/install/cheak_update`, postData);
}
  allUploadQuesiton(questions: Question[]) {
    let postData: any = {};
    postData.questions = questions;
    return this.post(this.getBaseUrl() + `/questions/`, postData);
}
  deleteQuestion(id: number) {
    let postData: any = {};
    return this.delete(this.getBaseUrl() + `/questions/${id}`, postData);
}
  getQuestions(examId: number, num: number) {
    let postData: any = {};
    postData.examId = examId;
    postData.num = num;
    return this.get(this.getBaseUrl() + `/questions`, postData);
}
  postQuestion(question:Question) {
    let postData: any = {};
    postData=question
    return this.post(this.getBaseUrl() + `/questions`, postData);
}
  putQuestion(id: number, question:Question) {
    let postData: any = {};
    postData=question
    return this.put(this.getBaseUrl() + `/questions/${id}`, postData);
}
  uploadTokenHead(filename: string) {
    let postData: any = {};
    postData.filename = filename;
    return this.get(this.getBaseUrl() + `/token/qiniu/head`, postData);
}
  upload(img: any) {
    let postData: any = {};
    postData.img = img;
    return this.post(this.getBaseUrl() + `/upload`, postData);
}
  deleteUser(id: number) {
    let postData: any = {};
    return this.delete(this.getBaseUrl() + `/users/${id}`, postData);
}
  getUser(id: number) {
    let postData: any = {};
    return this.get(this.getBaseUrl() + `/users/${id}`, postData);
}
  postUser(id: number) {
    let postData: any = {};
    postData.id = id;
    return this.post(this.getBaseUrl() + `/users`, postData);
}
  putUser(id: number, account: string, qq: number, password: string, userName: string, token: string, priv: string, mail: string, headPath: string, ip: string, language: string, botLove: any) {
    let postData: any = {};
    postData.account = account;
    postData.qq = qq;
    postData.password = password;
    postData.user_name = userName;
    postData.token = token;
    postData.priv = priv;
    postData.mail = mail;
    postData.head_path = headPath;
    postData.ip = ip;
    postData.language = language;
    postData.bot_love = botLove;
    return this.put(this.getBaseUrl() + `/users/${id}`, postData);
}

}