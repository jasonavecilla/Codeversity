class Webcam {
    constructor(webcamElement, facingMode = 'user', canvasElement = null, snapSoundElement = null) {
      this._webcamElement = webcamElement;
      this._webcamElement.width = this._webcamElement.width || 640;
      this._webcamElement.height = this._webcamElement.height || video.width * (3 / 4);
      this._facingMode = facingMode;
      this._webcamList = [];
      this._streamList = [];
      this._selectedDeviceId = '';
      this._canvasElement = canvasElement;
      this._snapSoundElement = snapSoundElement;
    }

    get facingMode(){
      return this._facingMode;
    }

    set facingMode(value){
      this._facingMode = value;
    }

    get webcamList(){
      return this._webcamList;
    }

    get webcamCount(){
      return this._webcamList.length;
    }

    get selectedDeviceId(){
      return this._selectedDeviceId;
    }

    /* Get all video input devices info */
    getVideoInputs(mediaDevices){
      this._webcamList = [];
      mediaDevices.forEach(mediaDevice => {
        if (mediaDevice.kind === 'videoinput') {
          this._webcamList.push(mediaDevice);
        }
      });
      if(this._webcamList.length == 1){
        this._facingMode = 'user';
      }    
      return this._webcamList;
    }

    /* Get media constraints */
    getMediaConstraints() {
        var videoConstraints = {};
        if (this._selectedDeviceId == '') {
            videoConstraints.facingMode =  this._facingMode;
        } else {
            videoConstraints.deviceId = { exact: this._selectedDeviceId};
        }
        var constraints = {
            video: videoConstraints,
            audio: false
        };
        return constraints;
    }

    /* Select camera based on facingMode */ 
    selectCamera(){
      for(let webcam of this._webcamList){
        if(   (this._facingMode=='user' && webcam.label.toLowerCase().includes('front'))
          ||  (this._facingMode=='enviroment' && webcam.label.toLowerCase().includes('back'))
        )
        {
          this._selectedDeviceId = webcam.deviceId;
          break;
        }
      }
    }

    /* Change Facing mode and selected camera */ 
    flip(){
      this._facingMode = (this._facingMode == 'user')? 'enviroment': 'user';
      this._webcamElement.style.transform = "";
      this.selectCamera();  
    }

    /*
      1. Get permission from user
      2. Get all video input devices info
      3. Select camera based on facingMode 
      4. Start stream
    */
    async start(startStream = true) {
      return new Promise((resolve, reject) => {         
        this.stop();
        navigator.mediaDevices.getUserMedia(this.getMediaConstraints()) //get permisson from user
          .then(stream => {
            this._streamList.push(stream);
            this.info() //get all video input devices info
              .then(webcams =>{
                this.selectCamera();   //select camera based on facingMode
                if(startStream){
                    this.stream()
                        .then(facingMode =>{
                            resolve(this._facingMode);
                        })
                        .catch(error => {
                            reject(error);
                        });
                }else{
                    resolve(this._selectedDeviceId);
                }
              }) 
              .catch(error => {
                reject(error);
              });
          })
          .catch(error => {
              reject(error);
          });
      });
    }

    /* Get all video input devices info */ 
    async info(){
      return new Promise((resolve, reject) => {            
        navigator.mediaDevices.enumerateDevices()
          .then(devices =>{
            this.getVideoInputs(devices);
            resolve(this._webcamList);
          }) 
          .catch(error => {
            reject(error);
          });
      });
    }
  
    /* Start streaming webcam to video element */ 
    async stream() {
      return new Promise((resolve, reject) => {         
        navigator.mediaDevices.getUserMedia(this.getMediaConstraints())
          .then(stream => {
              this._streamList.push(stream);
              this._webcamElement.srcObject = stream;
              if(this._facingMode == 'user'){
                this._webcamElement.style.transform = "scale(-1,1)";
              }
              this._webcamElement.play();
              resolve(this._facingMode);
          })
          .catch(error => {
              console.log(error);
              reject(error);
          });
      });
    }

    /* Stop streaming webcam */ 
    stop() {
      this._streamList.forEach(stream => {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      });   
    }

    snap() {
      if(this._canvasElement!=null){
        if(this._snapSoundElement!= null){
          this._snapSoundElement.play();
        }
        this._canvasElement.height = this._webcamElement.scrollHeight;
        this._canvasElement.width = this._webcamElement.scrollWidth;
        let context = this._canvasElement.getContext('2d');
        if(this._facingMode == 'user'){
          context.translate(this._canvasElement.width, 0);
          context.scale(-1, 1);
        }
        context.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
        context.drawImage(this._webcamElement, 0, 0, this._canvasElement.width, this._canvasElement.height);
        let data = this._canvasElement.toDataURL('image/png');
        return data;
      }
      else{
        throw "canvas element is missing";
      }
    } 
}
var sTabledata="";

$(document).ready(function() {

	$("[data-key=UserUname]").focus();

	$("#frm-login").on('submit',function (e)
    {
    	e.preventDefault();
    	var sLoadParent =	$("button[type=submit]");
    
        if (_checkFormFields($(this)) == true) {

        	var sJsonData =	{'data' : _collectFields($(this))};

        	ajaxQuery('/auth', sJsonData, sLoadParent);

        } else {
        	toastr.error('Please complete the required fields!');
        }
    });

});

function _checkFormFields(frmId="")
{
	var nCnt 		=	0;
	var nEmpty 		= 	0;
	var aElements 	=	$(frmId).find("input, textarea, select");
	
	for (nCnt = 0; nCnt < aElements.length; nCnt++) {
		var sElement=	aElements[nCnt];
		var sValue 	=	$(sElement).val();
		var sData 	=	$(sElement).attr("data");

		if ($(sElement).is(":visible")) 
		{
			if (sData != 'exclude')
			{
				if (sData == "req") {
					if (sValue == "")
					{
						$(sElement).addClass(" has-error ");
						nEmpty++;
					}
					else
					{

						$(sElement).removeClass(" has-error ");
					}
				}
			}
		}
	}

	if (nEmpty > 0) {
		return false;
	}
	else {
		return true;
	}
}

function _collectFields(vFormId){

	var sJsonFields =	{};
	var nCnt 	=	0;
	var nEmpty 	= 0;
	var aElements 	=	$(vFormId).find("input:not(:checkbox):not(:radio), textarea, select");

	
	for (nCnt = 0; nCnt < aElements.length; nCnt++) {
		
		var sElement=	aElements[nCnt];

		var sDataKey 	=	$(sElement).attr('data-key');
		var sValue 		=	$(sElement).val();

		if ($(sElement).is(":visible") === true) {
			if (sDataKey) {
				sJsonFields[sDataKey] = sValue;
			}
		}
	}

	return JSON.stringify(sJsonFields);
}

function _collectFieldsBatch(vFormId) {

	var sAllData 	=	[];
	var nCntr 		=	0;
	var aDivOrig 	=	$(vFormId).find('div.divOrig');

	for (nCntr = 0; nCntr <= aDivOrig.length; nCntr++) {
		var sDivOrig 	= aDivOrig[nCntr];

		if ($(sDivOrig).is(':visible') === true) {
			
			var sJsonFields =	{};	
			var aElements 	=	$(sDivOrig).find("input:not(:checkbox):not(:radio), textarea, select");
			var nLength 	=	aElements.length;
			var nLooper 	=	0;

			for (nLooper = 0; nLooper < nLength; nLooper++) {
				var sDataKey 	=	$(aElements[nLooper]).attr('data-key');
				var sValue 		=	$(aElements[nLooper]).val();
				if (sDataKey) {
					sJsonFields[sDataKey] = sValue;
				}
			}

			sAllData.push(sJsonFields);
		}
	}

	return JSON.stringify(sAllData);
}

function ajaxQuery(sUrl='', sData='', sLoadParent='') {
	$.ajax({
		url 		: sUrl,
		type 		: 'POST',
		headers 	: { 'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content') },
		data 		: sData,
		beforeSend	: function() {
			$("body").css({'pointer-events' : 'none'});
			$("div").css({'pointer-events' : 'none'});
			if (sLoadParent != '') {
				$(sLoadParent).append('<div class="spinner-border spinner-border-sm" role="status"> <span class="sr-only">Loading...</span> </div>');
			} else {
				$('div.overlay').show();
			}
		}, 
		success 	: function(result) {
			console.log(result);

			
			
			$("body").css({'pointer-events' : ''});
			$("div").css({'pointer-events' : ''});
			if (sLoadParent != '') {
				$(sLoadParent).parent().find('.spinner-border').remove();
			} else {
				$('div.overlay').hide();
			}

			eval(result);
		},
		error 		: function(e) {
			console.log(e.responseText);
			$("body").css({'pointer-events' : ''});
			$("div").css({'pointer-events' : ''});

			if (sLoadParent != '') {
				$(sLoadParent).parent().find('.spinner-border').remove();
			} else {
				$('div.overlay').hide();
			}

			toastr.error('Failed to complete the process!');
		}
	});
}


function _systemAlert(type="", msg="")
{
	switch(type)
	{
		case	"empty"	:
					var sTitle 		=	"System Alert";
					var sMessage	=	"Cannot continue, Please complete the required fields.";
		break;

		case	"email"	:
					var sTitle 		=	"System Alert";
					var sMessage	=	"Cannot continue, Invalid Email Address.";
		break;

		case	"system": 
		case 	"server":
					var sTitle 		=	"System Alert";
					var sMessage	=	"Cannot continue, Please call your system administrator.";
		break;

		case	"error"	:
					var sTitle 		=	"System Alert";
					var sMessage	=	msg;
		break;

		default:
					var sTitle 		=	"System Alert";
					var sMessage	=	type;
		break;
	}


	 $.alert({ title: sTitle, icon: 'fa fa-exclamation', type: 'red', content: sMessage, });
}

function _systemMsg(type="", msg="")
{
	switch(type)
	{
		case	"saved"	:
					var sMessage	=	"Data successfully saved.";
		break;

		case	"updated"	:
					var sMessage	=	"Data successfully updated.";
		break;

		case	"removed"	:
					var sMessage	=	"Data successfully removed.";
		break;

		case	"deactivated"	:
					var sMessage	=	"Data successfully deactivated.";
		break;

		default 		:
					var sMessage	=	type;
		break;
	}

	// _showToastr("success", "<b>System Notification</b> <br /> " + sMessage, "");
	_infoBox(sMessage);
}

function _confirm(sAction, sContent, sJsonData)
{
    $.confirm({
        title: 'System Notification',
        content: sContent,
        icon: 'fa fa-question-circle',
        type: 'orange',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Yes',
                btnClass: 'btn-green',
                action: function(){
                    _conTinue(sAction, sJsonData);
                }
            },
            moreButtons: {
                text: 'No',
                btnClass: 'btn-red',
                action: function(){
                    
                }
            },
        }
    });
}

function _infoBox(sContent)
{
    $.confirm({
        title: 'System Message',
        content: sContent,
        icon: 'fa fa-info-circle',
        type: 'green',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Ok',
                btnClass: 'btn-blue',
                action: function(){
                    
                }
            },
        }
    });
}

function _infoBox2(sContent, sFunc)
{
    $.confirm({
        title: 'System Message',
        content: sContent,
        icon: 'fa fa-info-circle',
        type: 'green',
        animation: 'scale',
        closeAnimation: 'scale',
        opacity: 0.5,
        buttons: {
            'confirm': {
                text: 'Ok',
                btnClass: 'btn-blue',
                action: function(){
                    eval(sFunc);
                }
            },
        }
    });
}

function _refresh() {
	location.reload(true);
}

function _paginate(){

	sTabledata 	= $('.table').DataTable({
  		"paging": true,
  		"lengthChange": false,
  		"searching": true,
  		"ordering": false,
  		"info": false,
  		"autoWidth": false,
	});
	
}

function _execWidgets() {

    $("input[trigger]").on('click', function(e) {
        var bChecked        =   $(this).is(':checked');
        if (bChecked) 
        {
            sTabledata.$('input[type=checkbox]').each(function () {
                if (!$(this).attr("disabled")) {
                    $(this).prop('checked', true); 
                }
            });
            $("[data-trigger=texts]").removeClass('disabled');
            
        } else {
            sTabledata.$('input[type=checkbox]').each(function () {$(this).prop('checked', false); });
            $("[data-trigger=texts]").addClass('disabled');
        }
    });
    
	sTabledata.$('input[type=checkbox]').each(function() {

        $(this).on('click', function() {

            var aCheckBox = sTabledata.$('input[type=checkbox]');
            var nChecked = 0;  

            if ($(this).attr('trigger')) {

                var bChecked        =   $(this).is(':checked');
                if (bChecked) 
                {
                    sTabledata.$('input[type=checkbox]').each(function () {

                            $(this).prop('checked', true); 
                        
                    });
                    $("[data-trigger=texts]").removeClass('disabled');
                    
                } else {
                    sTabledata.$('input[type=checkbox]').each(function () {$(this).prop('checked', false); });
                    $("[data-trigger=texts]").addClass('disabled');
                }
            } 
            else {
                sTabledata.$('input[type=checkbox]').each(function () {
                    if ($(this).is(':checked'))
                    {
                        nChecked++;
                    }
                });
                // console.log(nChecked);
                if (nChecked == (aCheckBox.length)) {
                    $("[trigger=all]").prop('checked', true);
                } else {

                    $("[trigger=all]").prop('checked', false);
                }

                if (nChecked == 0) {
                    $("[data-trigger=texts]").addClass('disabled');
                } else {
                    $("[data-trigger=texts]").removeClass('disabled');
                }
            }      
        });
    });
}