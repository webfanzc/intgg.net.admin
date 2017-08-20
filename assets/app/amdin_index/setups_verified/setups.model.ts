/**
 * Created by gy104 on 17/5/13.
 */



export class Setups {
    name:string;
    phone:string;
    email:string;
    idtype: string;
    idcard: string;
    idphoto:object[];
    brand: string;  //推广品牌
    brandlogo:string;  //推广logo
    verified?: number; //认证状态
    expireTime?: number; // 认证期限
    verifiedMsg?: string; // 认证的返回信息
    _id?:string;
    intid?: string;
    createTime?: number;
    constructor(
        name: string,
        phone: string,
        email: string,
        idtype:string,
        idcard: string,
        brand: string,
        brandLogo: string,
        idphoto: object[],
        _id?: string,
        intid?: string,
        verfiied?: number,
        expireTime?: number,
        verifiedMsg?: string,
        createTime?: number

    ){


        this.name = name;
        this.phone = phone;
        this.email = email;
        this.idtype = idtype;
        this.idcard = idcard;
        this.idphoto = idphoto;
        this.brand = brand;
        this.brandlogo = brandLogo;
        this._id = _id;
        this.intid = intid;
        this.verified = verfiied;
        this.expireTime = expireTime;
        this.verifiedMsg = verifiedMsg;
        this.createTime = createTime;
    }
}