import React, { useEffect } from "react";
import axios from "axios"

export default function DiseaseDescription() {
    var imageSrc = `disease${Math.floor(Math.random() * 5)}.jpg`;
    let getDescription = async e => {
        const queryParams = new URLSearchParams(window.location.search);
        const diseaseName = queryParams.get('disease');
        [...document.getElementsByClassName('DiseaseHeading')].forEach(element => {
            element.innerHTML = diseaseName;
        });
        try {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                }
            }
            var diseaseObj = { disease: diseaseName };
            var description = await axios.post("/API/getDescription", diseaseObj, config);
            description = description.data;
            document.getElementsByClassName("DiseaseDescription")[0].innerHTML = description;
        } catch (error) {
            alert(error.message)
        }
    }

    let removePrecautions = () =>{
        document.getElementById('precautionClickaway').remove();
    }

    let showPrecautions = async e => {
        var disease_name = document.getElementsByClassName('DiseaseHeading')[0].innerHTML;
        var diseaseObj = { disease: disease_name }
        try {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                }
            }
            var precautionContent = await axios.post("/API/getPrecautions", diseaseObj, config);
            precautionContent = precautionContent.data

            var precautionContainer = document.createElement('div');
            precautionContainer.setAttribute('class', 'clickaway_background');
            precautionContainer.id = "precautionClickaway";
            precautionContainer.innerHTML =
                `
        <div class="precautionContainer" style="min-width: 50%; min-height: 50%; text-align: center">
        <i class="fa fa-times" style="background: #ccc; position: absolute; top: 0px; right: 0px; margin-top: -8px; margin-right: -8px; cursor: pointer; color: black; padding: 0.3rem; border-radius: 50%" onclick='${removePrecautions}'></i>            
        <div id="precautionDiseaseHeading" class="font-medium">Precaution for ${disease_name}</div>
                    <div class="precautionContent text-sm mt-4">
                        ${precautionContent}
                    </div>
                </div>
        `
            document.body.prepend(precautionContainer);
            document.getElementById("precautionClickaway").style.display = "flex";
            document.getElementById("precautionClickaway").addEventListener('click', removePrecautions);
        } catch (error) {
            alert(error.message);
        }
    }
    return (
        <div className="content-section" onLoad={getDescription}>
            <img src={imageSrc} id="diseaseImg" className=" h-44 w-full rounded-lg" />
            <div className="DiseaseHeading"></div>
            <div className="DiseaseDescription"></div>
            <div className="DiseaseGroup">
                <div className="mr-auto flex flex-col justify-center">
                    <div className="font-medium text-sm text-left">Diagnostics Detail</div>
                    {/* <div className="text-xs text-gray-400 text-left">Group: Viral Fever</div> */}
                </div>
                <div className="flex flex-row ml-auto">
                    <button className="TestBtn mr-2">Tests</button>
                    <button className="PrecautionBtn" onClick={showPrecautions}>precautions</button>
                </div>
            </div>
            <div className="DiseaseSeverity">
                <div className="font-medium text-sm text-left mr-auto">Severity</div>
                <div className="text-sm text-gray-400 text-left ml-auto">High</div>
            </div>
        </div>
    );
}