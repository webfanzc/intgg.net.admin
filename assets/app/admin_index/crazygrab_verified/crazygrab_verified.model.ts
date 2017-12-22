
/**
 * Created by gy104 on 17/7/18.
 */
export class Crazygrab {
    total: string;  //总金额
    redType: string; // 红包类型
    minRed: string; //最小金额
    maxRed: string; //最大金额
    weight: string; // 权重
    startTime: string; // 开始时间
    endTime: string; // 结束时间
    sex: string; // 男
    minAge: string;
    maxAge: string;
    prinvce: string; // 省份
    city: string; // 城市
    createTime: string; // 创建时间
    materialid: string;
    _id: string;
    intid: string;
    use: string;
    verified: number;
    verifiedMsg: string;


    constructor(
        total: string,
        redType: string,
        weight: string,
        startTime: string,
        endtime: string,
        sex: string,
        prinvce: string,
        city: string,
        minAge: string,
        maxAge: string,
        materialid: string,
        minRed?: string,
        maxRed?: string,
        _id?: string,
        use?: string,
        createTime?: string,
        intid?: string,
        verified?: number,
        verifiedMsg?: string


    ){
        this.total = total;
        this.redType = redType;
        this.weight = weight;
        this.startTime = startTime;
        this.endTime = endtime;
        this.sex = sex;
        this.prinvce = prinvce;
        this.city = city;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.materialid = materialid;
        this.minRed = minRed;
        this.maxRed = maxRed;
        this._id = _id;
        this.createTime = createTime;
        this.intid = intid;
        this.use = use;
        this.verified = verified;
        this.verifiedMsg = verifiedMsg;

    }
}