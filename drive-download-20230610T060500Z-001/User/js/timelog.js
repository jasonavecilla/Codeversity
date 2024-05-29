

$(document).ready(function() {

	const webcamElement = document.getElementById('webcam');
	const canvasElement = document.getElementById('canvas');
	const snapSoundElement = document.getElementById('snapSound');
	const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);

	webcam.start().then(result => { 
		console.log('webcam-start');
	}).catch(err => { 
		console.log(err);
	});

	// iTimer 	= setInterval('getTime()', 1000);
	// iRecord = setInterval('logTime()', 3000);

	$("#btnCapture").on('click', function() {
		let picture = webcam.snap();

		
		document.querySelector('#aLogPhoto').href = picture;
		var sHref 	=	dataURLToBlob($('#aLogPhoto').attr("href"));
		var formData = new FormData();
		formData.append('logphoto', sHref);

		$.ajax({
	            url : 'log.php',
	            method: "POST",
	            data: formData,
	            processData: false,
	            contentType: false,
	            beforeSend : function() {
	                
	            },
	            success: function (result) {
	               console.log(result);
	            },
	            error: function (xhr) {
	                console.log(xhr);
	            }
	        });
	});
	
	$("[data-key=PersonCode]").on('keyup', function(e) {

		clearInterval(iTimer);
		clearInterval(iRecord);	

		var nCode 	=	$(this).val();
		var nAscii 	=	e.which;


		// if (nAscii == 13) {
			
			beforeTakePhoto();
            let picture = webcam.snap();
			document.querySelector('#aLogPhoto').href = picture;

			var sHref 	=	dataURLToBlob($('#aLogPhoto').attr("href"));
			var formData = new FormData();
    		// formData.append('logphoto', sHref);
    		// formData.append('empid', nCode);
    		// formData.append('action', 'timer');

    		// $.ajax({
	        //     url : 'log.php',
	        //     method: "POST",
	        //     // headers 	: { 'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content') },
	        //     data: formData,
	        //     processData: false,
	        //     contentType: false,
	        //     beforeSend : function() {
	                
	        //     },
	        //     success: function (result) {
	        //        console.log(result);
	        //        eval(result);
	                
	        //     },
	        //     error: function (xhr) {
	        //         console.log(xhr);
	        //     }
	        // });



			// ajaxQuery('/time/log', {'empid' : nCode},'timer');

		// } else {
		// 	iTimer = setInterval('getTime()', 1000);
		// 	iRecord = setInterval('logTime()', 3000);
		// }

	});
});


function getTime()   {

	ajaxQuery('/time/get', '', 'timer');

}

function logTime()   {

	if ($(".card-time-log").is(":visible")) {
		$(".card-time-log").addClass(' d-none ');
	}
}

function beforeTakePhoto(){
    $('.flash')
        .show() 
        .animate({opacity: 0.3}, 500) 
        .fadeOut(500)
        .css({'opacity': 0.7});
    
}

function afterTakePhoto(){
    webcam.stop();

    $('[data-action=take-photo]').addClass('disabled');
    $('[data-action=use-photo]').removeClass('disabled');
    $('[data-action=reset-photo]').removeClass('disabled');

    $('#canvas').removeClass('d-none');
    $('#webcam').addClass('d-none')
    $('#take-photo').addClass('d-none');
}



function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  var parts = dataURL.split(';base64,');
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

function pad2(n) { return n < 10 ? '0' + n : n }