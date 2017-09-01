/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import {MaterialService, MaterialSearchParams} from "./material.verified.service";
import {Material} from "./material.verified.model";
import * as util from "../../util"
import {FormGroup, FormControl} from "@angular/forms";

@Component ({
    selector: 'material_verified',
    templateUrl: 'mateiral_verified.component.html',
    styleUrls: [
        'material_verified.component.css'
    ],
    providers: [
        MaterialService
    ]

})
export class MaterialVerifiedComponent implements OnInit{
    materials : Material[] = [];
    materialResovle: Material[] = [];
    materialReject: Material[] = [];
    material: Material;
    materialIndex: number;
    path: string = util.path;
    verified: number = 0;
    reject: boolean = true;
    materialForm: FormGroup;
    searchForm: FormGroup;
    rejectInfo = [
        {value: '素材内容包含违法信息', viewValue: 'Steak'},
        {value: '素材内容不清晰', viewValue: 'Pizza'},
    ];

    showPositions = [
        {value:'all',viewValue:'全部'},
        {value:'闲时页面视频',viewValue:'闲时页面视频'},
        {value:'闲时页面banner',viewValue:'闲时页面banner'},
        {value:'开奖页面视频',viewValue:'开奖页面视频'},
        {value:'开奖页面背景',viewValue:'开奖页面背景'},
        {value:'结果页面背景',viewValue:'结果页面背景'},
        {value:'结果页面banner',viewValue:'结果页面banner'},
        {value:'疯抢页面视频',viewValue:'疯抢页面视频'},
        {value:'疯抢页面图片',viewValue:'疯抢页面图片'}
    ];
    types = [
        {value:'all',viewValue:'全部'},
        {value:'video',viewValue:'视频'},
        {value:'music',viewValue:'音频'},
        {value:'image',viewValue:'图片'}
    ]
    constructor(private materialService: MaterialService){
        if(this.reject) {
            this.materialService.getMaterials(0,1,30)
        }else {
            this.materialService.getMaterials(1,1,30)
        }
        this.materialService.getMaterials(0);
    }

    materialVerified(index: number, material: Material){
       this.material = material;
       this.materialIndex = index;
    }
    passMaterial(material: Material) {
        material.verified = 1;
        material.verifiedMsg = '审核通过';

        this.materialService.updateMaterial(material);
    }

    searchMaterial() {
        let data = this.searchForm.value;
        this.materialService.searchMaterial(new MaterialSearchParams(data.type, data.position, data.date));
    }

    searchMaterialByName(event: any) {
        let value = event.target.value;
        this.materialService.searchMaterialByName(event.target.value);
    }

    selectResolve(){
        this.reject = true;
        this.verified = 0;
        this.materialService.getMaterials(0,1,30);
    }
    selectReject() {
        this.reject = false;
        this.verified = 1;
        this.materialService.getMaterials(1,1,30);

    }

    rejectMaterial(){
        this.material.verified = 2;
        let value = this.materialForm.value;
        if(value.writeInfo != null) {
            this.material.verifiedMsg = value.writeInfo;
        }
        if(value.selectInfo != null){
            this.material.verifiedMsg = value.selectInfo;
        }
        if(value.selectInfo == null && value.writeInfo == null) {
            this.material.verifiedMsg = '审核未通过';
        }
        this.materialService.updateMaterial(this.material);

    }
    ngOnInit(){
        this.materialService.materialsChange
            .subscribe(
                (materials: Material[]) => {
                    this.materials = materials;
                    this.materialResovle = materials
                        .filter(
                            (item) => {
                                return item['verified'] == 0;
                            }
                        )
                }
            )
        this.initForm();
    }

    private initForm(){
        this.materialForm = new FormGroup({
            selectInfo: new FormControl(),
            writeInfo: new FormControl()
        })
        this.searchForm = new FormGroup({
            date: new FormControl(),
            type: new FormControl(),
            position: new FormControl()
        })
    }
}