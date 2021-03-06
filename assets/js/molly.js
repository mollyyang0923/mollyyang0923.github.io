/*
    Industrious by TEMPLATED
    templated.co @templatedco
    Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

////////////////////////////////////////////////////////////////////////////////
//conponent
var mydata =[];
var lastSel;
var btn1=$("#btn1");
var btn2=$("#btn2");
var btn3=$("#btn3");
var btn4=$("#btn4");
var btn5=$("#btn5");

var div1=$("#div1");
var div2=$("#div2");

var div1_class=$(".div1");
var div2_class=$(".div2");

var Action_select=document.getElementById("select_opt");
var Infile1=document.getElementById('Infile1');

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//COMMON FUNCTION
////////////////////////////////////////////////////////////////////////////////
function check_grid_data_not_empty(){

    var p = $("#Table_1").jqGrid("getGridParam",'data');

    if (typeof p === "undefined"){
        return 1
    }else if( p.length == 0 ){
        return 1
    }else{
        return 0
    }

}

function reSizejqGridWidth()
{
    // 重新抓jqGrid容器的新width
    let newWidth = $("#Table_1").parent().width();
    let newHeight = $("#Table_1").parent().height();
    // 是否縮齊column(相當於shrinkToFit)
    let shrinkToFit = true;
    $("#Table_1").jqGrid("setGridWidth", newWidth, shrinkToFit);
    $("#Table_1").jqGrid("setGridHeight", newHeight, shrinkToFit);
}
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//Function of Batch Gen .rcp from .sh File
////////////////////////////////////////////////////////////////////////////////

function Choose_Batch_gen_recipe(){

    console.log("DO : " + arguments.callee.name );

    // contorl vision
    div1_class.show();
    div2_class.hide();

    btn2.addClass('disabled');
    btn5.addClass('disabled');

    // let sh_type_s = document.getElementById('sh_type')
    // sh_type_s.value = "#!/usr/bin/rsh -R"

    // let recipe_s = document.getElementById('recipe')
    // recipe_s.value = "Show board temperature;"

    // let item_num_s = document.getElementById('item_num')
    // item_num_s.value = "1"

    // let cmd_s = document.getElementById('cmd')
    // cmd_s.value = "bdtmp.sh;"

    // let opt_s = document.getElementById('opt')
    // opt_s.value = "OPT_1_N=1;\nOPT_1_1=;"

    // let rs_tmp = document.getElementById('rs_template')
    // rs_tmp.value = "#!/usr/bin/rsh -R"
    // rs_tmp.value += "\n"
    // rs_tmp.value += "## Show board temperature #############"
    // rs_tmp.value += "\n"
    // rs_tmp.value += "Recipe=Show board temperature;"
    // rs_tmp.value += "\n"
    // rs_tmp.value += "ItemN=1;"
    // rs_tmp.value += "\n"
    // rs_tmp.value += "CMD=bdtmp.sh;"
    // rs_tmp.value += "\n"
    // rs_tmp.value += "\n"
    // rs_tmp.value += "OPT_1_N=1;"
    // rs_tmp.value += "\n"
    // rs_tmp.value += "OPT_1_1=;"
    // rs_tmp.value += "\n"


    console.log("DONE : " + arguments.callee.name );

}

function Batch_gen_recipe(){

    console.log("DO : " + arguments.callee.name );

    var res = check_grid_data_not_empty()
    if ( res != 0 ){
        alert("No data to generate.")
        return
    }

    //check output .rcp file path
    gen_recipe()
    console.log("DONE : " + arguments.callee.name );
}

function Batch_gen_recipe_save(){

    console.log("DO : " + arguments.callee.name );

    var res = check_grid_data_not_empty()
    if ( res != 0 ){
        alert("No data to save.")
        return
    }

    btn2.removeClass('disabled');

    //save current all jqGrid
    var q = $("#Table_1").jqGrid("getGridParam",'data');
    for  (var i = 1; i <= q.length; i++){
        jQuery("#Table_1").jqGrid('saveRow',i, false, 'clientArray');
        jQuery('#Table_1').jqGrid('editRow',i, true, null, null, 'clientArray');
    }

    alert("SAVE OK");

    console.log("DONE : " + arguments.callee.name );

}

function fileSelected_1() {

    $("#Table_1").jqGrid("clearGridData", true);
    mydata=[];
    var pageWidth = $("#Table_1").parent().width();
    var pageHeight = $("#Table_1").parent().height();
    // console.log("pageWidth = " + pageWidth);
    // console.log("pageHeight = " + pageHeight);

    var fi = Infile1;

    if (fi.files.length > 0) {

        var Invalid_input="";
        var Valid_file_num=1;
        // console.log("files.length="+fi.files.length);
        for (var i = 1; i <= fi.files.length ; i++) {

            var fname = fi.files.item(i-1).name;      // THE NAME OF THE FILE.
            var fsize = fi.files.item(i-1).size;      // THE SIZE OF THE FILE.
            // console.log(fname);

            if ( fname.substr((fname.lastIndexOf('.') +1)) === "sh" ){
                var tmp = gen_recipe_by_filename(fname);
                // console.log(tmp);

                mydata.push({
                    "id":Valid_file_num,
                    "FileName":fname,
                    "Template":tmp
                    // "Template":"<textarea>"+tmp+"</textarea>"//編輯時會有<textarea>
                });
                // console.log("mydata="+mydata);
                Valid_file_num++;
            }else{
                Invalid_input = Invalid_input + fname + "\n";
            }

        }

        if (Invalid_input.length != 0){
            alert("Invalid input (not .sh) file name:\n"+Invalid_input);
        }

    }
    else {
        alert('Please select a file.')
    }


    jQuery("#Table_1").jqGrid({
        datatype: "local",
        // data: mydata, //會重複顯示
        width: pageWidth,

        colNames:['No.','FileName', 'Template'],
        colModel:[
            {name:'id',index:'id', width:(pageWidth*(5/100)), sorttype:"int",editable:false },
            {name:'FileName',index:'FileName', width:(pageWidth*(35/100)), editable:false },
            {name:'Template',index:'Template', width:(pageWidth*(60/100)), rows:9 , editable:true, edittype: "textarea", editoptions:{ rows:9 }},

        ],

        editurl: 'clientArray',

        ondblClickRow: function (rowid, iRow,iCol) {
            // console.log("ondblClickRow" + rowid );
            jQuery('#Table_1').editRow(rowid, true);
            reSizejqGridWidth();
            btn2.addClass('disabled');
        },

        gridComplete: function(){
            var ids = jQuery("#Table_1").jqGrid('getDataIDs');
            for(var i=1;i <= ids.length;i++){
                jQuery('#Table_1').jqGrid('editRow', i, true, null, null, 'clientArray');
            }
            reSizejqGridWidth();
        },


        multiselect: true,
        // caption: "Manipulating Array Data"
    // }).navGrid("#Table_1_Pager",{edit:false,add:true,del:false});;
    });

    function formatter(v) {
        return '<div style="height: 200px">' + v + '</div>';
    }

    for(var i=0;i<mydata.length;i++){
        jQuery("#Table_1").jqGrid('addRowData',mydata[i].id,mydata[i]);
    }

    reSizejqGridWidth();

    $(window).on("resize", reSizejqGridWidth);



}


////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//Function of Gen Scenario (BI) File
////////////////////////////////////////////////////////////////////////////////

function Choose_scenario_script(){

    console.log("DO : " + arguments.callee.name );

    // contorl vision
    div1_class.hide();
    div2_class.show();

    btn2.addClass('disabled');
    btn5.addClass('disabled');

    console.log("DONE : " + arguments.callee.name );
}

function Gen_Scenario_script(){

    console.log("DO : " + arguments.callee.name );

    

    console.log("DONE : " + arguments.callee.name );

}


function Gen_Scenario_script_save(){

    console.log("DO : " + arguments.callee.name );
    console.log("DONE : " + arguments.callee.name );

}

function fileSelected_2() {


}
////////////////////////////////////////////////////////////////////////////////


function gen_recipe_by_filename(filename){

    let fname=filename;
    filename_trip_1=filename.replace(".sh", "");
    filename_trip_2=filename_trip_1.replaceAll("_", " ");

    let rs_tmp = "";
    rs_tmp = "#!/diagnostic/bin/rsh -R";
    rs_tmp += "\n";
    rs_tmp += "## " + filename_trip_2 + "#############";
    rs_tmp += "\n";
    rs_tmp += "Recipe=" + filename_trip_2 + ";";
    rs_tmp += "\n";
    rs_tmp += "ItemN=1;";
    rs_tmp += "\n"
    rs_tmp += "CMD=" + fname + ";";
    rs_tmp += "\n";
    rs_tmp += "\n";
    rs_tmp += "OPT_1_N=1;";
    rs_tmp += "\n";
    rs_tmp += "OPT_1_1=;";
    rs_tmp += "\n";

    // console.log("rs_tmp = " + rs_tmp);
    return rs_tmp;
}



function gen_recipe(){

    // alert download file number
    // get the reference to all parameters of the grid
    var p = $("#Table_1").jqGrid("getGridParam",'data');
    // console.log("You will download " + p.length + " files.")

    if (confirm("Remember to click \"SAVE EDITED DATA\" before generate file.\nAre you sure download " + p.length + " files?")) {
      // Save it!
      console.log('Click yes to download files.');
    } else {
      // Do nothing!
      console.log('Click no to Do nothing.');
      return
    }

    for (var i = 0; i < p.length; i++) {

        //read rawdata
        let output_fc = p[i].Template;

        //output file name
        let output_fname=p[i].FileName.replace(".sh", "");

        //save file
        // var file_url = new Blob([output_fc], { type: 'text/plain' });//這會自動變成.txt檔
        var file_url = new Blob([output_fc], {type: "octet/stream"});
        var a = document.createElement('a');
        a.download = output_fname+".rcp";
        a.href = window.URL.createObjectURL(file_url);
        a.textContent = 'Download ready';
        a.style='display:none';
        a.click();
    }

    // let sh_type_s = document.getElementById('sh_type')
    // let recipe_s = document.getElementById('recipe')
    // let item_num_s = document.getElementById('item_num')
    // let cmd_s = document.getElementById('cmd')
    // let opt_s = document.getElementById('opt')

    //composite file
    // tmp.concat(sh_type_s.value);
    // tmp.concat("## Auto gen by script #########");
    // tmp.concat(recipe_s.value);
    // tmp.concat(item_num_s.value);
    // tmp.concat(cmd_s.value);
    // tmp.concat("");
    // tmp.concat(opt_s.value);

}





// function open_file_option() {
    // console.log("DO : open_file_option" );
    // document.getElementById("input_file").click();

    // var files = document.getElementById('input_file').files;
    // for (var i = 0; i < files.length; i++) {
    // }

// }




function uploadFile() {
    console.log("DO : " + arguments.callee.name );
    console.log("DONE : " + arguments.callee.name );
}



$(document).ready(function() {

    btn1.click(function() {

        switch(Action_select.value){
            case 'opt1' :
                Choose_Batch_gen_recipe();
                break;
            case 'opt2' :
                Choose_scenario_script();
                break;
            default:
        }

    });

    btn2.click(function(event) {

        event.preventDefault();//avoid auto scroll to top

        switch(Action_select.value){
            case 'opt1' :
                Batch_gen_recipe();
                break;
            case 'opt2' :
                Gen_Scenario_script();
                break;
            default:
        }

    });

    btn3.click(function() {

        switch(Action_select.value){
            case 'opt1' :
                Batch_gen_recipe_save();
                break;
            case 'opt2' :
                Gen_Scenario_script_save();
                break;
            default:
        }

    });

});