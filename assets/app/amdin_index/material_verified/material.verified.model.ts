/**
 * Created by gy104 on 17/4/1.
 */

export class Material {
    name : string;
    position : string;
    link : string;
    url : string;
    content : string;
    createTime? : number;
    updateTime? : number;
    type? : string;
    materialComplete: string;
    _id?:string;
    intid?: string;
    verified: number;
    verifiedMsg: string;
    constructor(name: string,
                position: string,
                link: string,
                url: string,
                content: string,
                type?: string,
                createTime?: number,
                _id?: string,
                verified?: number,
                verifiedMsg?: string,
                intid?: string
                ) {
        this.name = name;
        this.position = position;
        this.link = link;
        this.url = url;
        this.content = content;
        this.createTime = createTime;
        this.type = type;
        this._id = _id;
        this.verified = verified;
        this.intid = intid;
        this.verifiedMsg = verifiedMsg;
    }

}