import React from "react";
import axios from "axios";

export default function Symptoms(){

    
var symptomsArray = [];
var diseaseArr = [];

let enterSymptoms = () => {
    if (document.getElementsByClassName("symptomBoxEmpty").length < 1) {
        var symptomContainer = document.getElementById('symptomContainer');
        var container = document.createElement('div');
        container.classList.add('SymptomBoxParent');
        container.innerHTML = `<i class="fa fa-times symptomBoxIcon"></i>`;
        container.querySelector('.fa-times').addEventListener('click', function(){
            var data = this.parentElement.querySelector('input').value;
            symptomsArray = symptomsArray.filter(x=>x.toLowerCase() !== data.toLowerCase());
            this.parentElement.remove();
            console.log(symptomsArray);
        });
        var emptyBox = document.createElement('input');
        emptyBox.type = 'text';
        emptyBox.classList.add('symptomBoxEmpty');
        container.appendChild(emptyBox)
        symptomContainer.appendChild(container);
        emptyBox.focus();
        emptyBox.onkeydown = function (event) {
            if (event.code === "Enter") {
                event.preventDefault();
                if (event.target.value.trim().length !== 0) {
                    event.target.parentElement.querySelector("i").style.display = "block";
                    event.target.classList.remove('symptomBoxEmpty');
                    event.target.classList.add("symptomBox");
                    event.target.readOnly = true; //makes textbox readonly hence uneditable or unfocusable
                    var value = event.target.value;
                    var valueArr = value.split(" ");
                    for (var i = 0; i < valueArr.length; i++) {
                        valueArr[i] = valueArr[i].charAt(0).toUpperCase() + valueArr[i].substring(1);
                    
                    }
                    value = valueArr.join(" ");
                    value = value.trim();
                    symptomsArray.push(value);
                    console.log(symptomsArray);
                    enterSymptoms(false);
                }
            }
        };
    }
    else {
        document.getElementsByClassName("symptomBoxEmpty")[0].focus();
    }
}

let submitSymptoms = async e =>{
    e.preventDefault();
    if(symptomsArray.length == 0){
        alert("Please enter symptom");
        return 0;
    }
    try {
        const config = {
            headers: {
                'Content-Type':'Application/json'
            },
        }
        var symptomsObj = {symptoms: symptomsArray}
        var spinner = document.createElement('div');
        spinner.setAttribute('class', 'spinner');
        var spinnerBackground = document.createElement('div');
        spinnerBackground.setAttribute('class', 'preloaderBackground');
        spinnerBackground.appendChild(spinner);
        document.body.prepend(spinnerBackground);

        //post symptoms
        var res = await axios.post("/API/postSymptoms", symptomsObj, config);
        console.log(res.data);
        
        //filter repeated predicted disease and put in localstorage in array form
        var diseaseObj = res.data

        //push object in array
        for (var [key, value] of Object.entries(diseaseObj)) {
            diseaseArr.push(`${value}`);
          }

        //check and filter repeated diseases
        for(var i=0; i<diseaseArr.length; i++){
            if(diseaseArr[i+1]){
                for(var j=i+1; j<diseaseArr.length; j++){
                if(diseaseArr[i] === diseaseArr[j]){
                    diseaseArr[i] = null;
                    break;
                }
            }
        }
        }
        diseaseArr = diseaseArr.filter(x=>x !== null);
        
        //put disease array in local storage
        var localStorageData = localStorage.getItem("predictedDisease");
        if(localStorageData){
            localStorage.removeItem("predictedDisease");
        }
        localStorage.setItem("predictedDisease", JSON.stringify(diseaseArr));
        window.location.href = "/possibleDisease";
    } catch (error) {
        alert(error.message);
    }
}
    
    return(
        <div className="content-section">
        <div className="heading_main">Describe your<br/><strong>Symptoms</strong></div>
        <div className="subtitles">
            Mention down all the Symptoms experienced by the user to help us analyze the root cause
        </div>
        <form onSubmit={e=>submitSymptoms(e)} >
        <div id="symptomForm" className="w-full sm:w-2/3 h-72 ml-auto mr-auto border-2 px-4 border-gray-300 rounded-md  mt-4 overflow-y-auto text-left text-sm p-2 focus:outline-none"
        onClick={enterSymptoms} onFocus={enterSymptoms} >
            <div id="symptomContainer">
            </div>
        </div>
        <div className="w-full sm:w-2/3 mt-4 sm:mt-12 ml-auto mr-auto"><button type="submit" className="btn_default">Submit Symptoms</button></div>
        </form>
    </div>
    );
}