/**
 * Created by gy104 on 17/5/13.
 */



// export class Setups {
//     name:string;
//     phone:string;
//     email:string;
//     idtype: string;
//     idcard: string;
//     idphoto:object[];
//     brand: string;  //推广品牌
//     brandlogo:string;  //推广logo
//     isAuth?: number; //认证状态
//     expireTime?: number; // 认证期限
//     verifiedMsg?: string; // 认证的返回信息
//     _id?:string;
//     intid?: string;
//     createTime?: number;
//     constructor(
//         name: string,
//         phone: string,
//         email: string,
//         idtype:string,
//         idcard: string,
//         brand: string,
//         brandLogo: string,
//         idphoto: object[],
//         _id?: string,
//         intid?: string,
//         isAuth?: number,
//         expireTime?: number,
//         verifiedMsg?: string,
//         createTime?: number
//
//     ){
//
//
//         this.name = name;
//         this.phone = phone;
//         this.email = email;
//         this.idtype = idtype;
//         this.idcard = idcard;
//         this.idphoto = idphoto;
//         this.brand = brand;
//         this.brandlogo = brandLogo;
//         this._id = _id;
//         this.intid = intid;
//         this.isAuth = isAuth;
//         this.expireTime = expireTime;
//         this.verifiedMsg = verifiedMsg;
//         this.createTime = createTime;
//     }
// }


export class Setups {
    idtype: string; // 类型： 0 个人， 1公司

    comInfo: string; // 公司；
    comName: string; // 公司时，就是公司名称，个人时吧个人的名字放到里面，同name;
    comCode: string; // 公司时，就是公司统一信用代码，个人时把个人的身份证号放到里面，同idNo;

    name: string; // 个人或法人姓名；
    phoneNo: string; // 个人手机号，或法人手机号；
    idNo: string; // 个人或法人身份证号；
    cardNo: string; // 个人或者法人银行卡号；

    brand: string; // 推广品牌
    brandlogo: string; // 品牌logo

    isAuth: number; //是否认证过 0表示没有认证,1表示认证通过,2表示认证失败,3表示认证过期（接口调用时自动赋值）,4表示账号被冻结（登录除外）
    authTime: number; // 创建时间；
    verifiedMsg: string;

    expireTime: number;
    createTime: number;
    updateTime: number;
    intid: string;
    _id: string;

    constructor(
        brand?: string,
        brandlogo?: string,
        idtype?: string,
        comName?: string,
        comCode?: string,
        name?: string,
        phoneNo?: string,
        idNo?: string,
        cardNo?: string,
        isAuth?: number,
        verifiedMsg?: string,
        expireTime?: number,
        _id?: string,
        createTime?: number
    ){
        this.idtype = idtype;
        this.comName = comName;
        this.comCode = comCode;
        this.name = name;
        this.phoneNo = phoneNo;
        this.idNo = idNo;
        this.cardNo = cardNo;
        this.brand = brand;
        this.brandlogo = brandlogo;
        this.isAuth = isAuth;
        this.verifiedMsg = verifiedMsg;
        this.expireTime = expireTime;
        this._id = _id;
        this.createTime = createTime;
    }
}