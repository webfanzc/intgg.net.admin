/**
 * Created by gy104 on 17/11/7.
 */
export class Droppack {
    packname: string;  //投放包名称
    brand: string;
    brandlogo: string;
    configInfo?: any;
    prizesInfo?:any;
    _id?: string;
    classType: string;
    verified ?:number;
    verifiedMsg ?:string;
    createTime ?:Date;
    intid: any;
    constructor(
        packname: string,
        brand: string,
        brandlogo: string,
        classType: string,
        _id?: string,
        intid?: any,
        configInfo?: any,
        prizesInfo?: any,
        createTime?: Date,
        verified ?: number,
        verifiedMsg ?: string,


    ){
        this.classType = classType;
        this.packname = packname;
        this.brand = brand;
        this.brandlogo = brandlogo;
        this.configInfo = configInfo;
        this.prizesInfo = prizesInfo;
        this._id = _id;
        this.intid = intid;
        this.verified = verified;
        this.verifiedMsg =verifiedMsg;
        this.createTime = createTime;
    }



}
//
// export class ConfigInfo{
//     community: Community;
//     interaction: Interaction;
//     result: Result;
//     constructor(community?: Community,interaction?: Interaction,result?: Result){
//         this.community = community;
//         this.interaction = interaction;
//         this.result = result;
//     }
// }
//
// export class Community {
//     video : video[];
//     banner: banner[];
//     constructor(video?: video[], banner?: banner[]) {
//         this.video = video;
//         this.banner = banner;
//     }
// }
// export class Interaction {
//     video: video[];
//     banner: banner[];
//     background: background[];
//     activity: any;
//     constructor(video?: video[], banner?: banner[],background?: background[],activity?: any){
//         this.video = video;
//         this.banner = banner;
//         this.background = background;
//         this.activity = activity;
//     }
// }
// export class Result {
//     background: background[];
//     banner: banner[];
//     constructor(background?: background[], banner?: banner[]){
//         this.banner = banner;
//         this.background = background;
//     }
// }
//
// export class video {
//     _id: string;
//     value: string;
//     constructor(_id?: string, value?: string){
//         this._id = _id;
//         this.value = value;
//     }
// }
//
// export class banner {
//     _id: string;
//     value: string;
//     link: string
//     constructor(_id?: string, value?: string,link?: string){
//         this._id = _id;
//         this.value = value;
//         this.link = link;
//     }
// }
//
// export class background {
//     _id: string;
//     value: string;
//
//     constructor(_id?: string, value?: string){
//         this._id = _id;
//         this.value = value;
//     }
// }