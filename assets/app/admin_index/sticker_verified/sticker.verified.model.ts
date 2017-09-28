/**
 * Created by gy104 on 17/4/1.
 */

export class Sticker {
    total: string;  //总金额
    createTime: string; // 创建时间
    materialid: string;
    verified: number;
    verifiedMsg: string;
    _id: string;
    intid: string;
    constructor(
        total: string,
        materialid: string,
        _id?: string,
        createTime?: string,
        verified?: number,
        verifiedMsg?: string,
        intid?: string
    ){
        this.total = total;
        this.createTime = createTime;
        this.materialid = materialid;
        this.verified = verified;
        this.verifiedMsg = verifiedMsg;
        this._id = _id;
        this.intid = intid;
    }
}