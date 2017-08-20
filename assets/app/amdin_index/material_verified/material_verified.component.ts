/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import {MaterialService} from "./material.verified.service";
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
    material: Material;
    materialIndex: number;
    path: string = util.path;
    reject: boolean = true;
    materialForm: FormGroup;
    rejectInfo = [
        {value: '素材内容包含违法信息', viewValue: 'Steak'},
        {value: '素材内容不清晰', viewValue: 'Pizza'},
    ];
    constructor(private materialService: MaterialService){
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

    selectResolve(resolve: any, reject: any){
        this.reject = true;
        this.materialService.getMaterials(0);
    }
    selectReject(resolve: any, reject: any) {
        this.reject = false
        this.materialService.getMaterials(1);

    }

    rejectMaterial(){
        this.material.verified = 2;
        let value = this.materialForm.value;
        if(value.writeInfo == null) {
            this.material.verifiedMsg = value.selectInfo;

        }else {
            this.material.verifiedMsg = value.writeInfo;
        }
        this.materialService.updateMaterial(this.material);

    }
    ngOnInit(){
        this.materialService.materialsChange
            .subscribe(
                (materials: Material[]) => {
                    console.log(materials);
                    this.materials = materials;
                }
            )
        this.initForm();
    }

    private initForm(){
        this.materialForm = new FormGroup({
            selectInfo: new FormControl(),
            writeInfo: new FormControl()
        })
    }
}