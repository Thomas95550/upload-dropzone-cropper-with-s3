// transform cropper dataURI output to a Blob which Dropzone accepts
var dataURItoBlob = function (dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: 'image/jpeg'});
};

Dropzone.autoDiscover = false;
var c = 0;

var myDropzone = new Dropzone(".my-dropzone-container", {
    addRemoveLinks: true,
    parallelUploads: 10,
    uploadMultiple: false,
    acceptedFiles: 'image/*, .pdf, .docx, .doc',
    maxFiles: 10,
    init: function () {
        this.on("addedfile", function(file) {
            console.log('file added');
            console.log(file);
            var getDatase;
            var filesz = file.name.replace(/[!@#$%^&*]/g, "");
            filesz = RemoveAccents(filesz);
            $.ajax({
                url: "./ajax/before_upload/fileExist.php",
                data: { imageId: filesz},
                type: 'POST',
                async: false,
                success: function (data) {
                    window.getDatase = data;
                },
                error: function (data) {}
            });
            return file.upload.filename = window.getDatase;
        });
        this.on('success', function (file) {
            console.log(file);

            $(file.previewElement).find(".dz-filename > span").text(window.getDatase);
            if(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
                var $button = $('<a href="#" class="js-open-cropper-modal" data-file-name="' + window.getDatase + '"><i class="fas fa-crop" style="cursor: pointer"></i></a>');
                $(file.previewElement).append($button);
            }
            if(file.type === 'application/pdf'){
                $(file.previewElement).find('img').attr('src', 'assets/img/pdf.png');
            }
            if(file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                $(file.previewElement).find('img').attr('src', 'assets/img/docx.png');
            }

            $(".dz-remove").on("click", function (e) {
                e.preventDefault();
                var imageId = $(this).parent().find(".dz-filename > span").text();
                $.ajax({
                    url: "./ajax/delete/deleteUpload.php",
                    data: { imageId: imageId},
                    type: 'POST',
                    success: function (data) {},
                    error: function (data) {}
                })
            });
        });
    },
    url: './ajax/upload/upload.php'
});

$('.my-dropzone-container').on('click', '.js-open-cropper-modal', function (e) {
    e.preventDefault();

    var fileName = $(this).data('file-name');

    function isSession(fileName) {
        var result = false;

        $.ajax({
            url: "./ajax/get_image/getImage.php",
            data: { imageName: fileName},
            type: 'POST',
            async: false,
            success: function (data) {
                result = data;
            },
            error: function (data) {}
        });
        return result;

    }
    console.log(isSession(fileName));

    var modalTemplate =
        '<div class="modal fade" tabindex="-1" role="dialog">' +
        '<div class="modal-dialog modal-lg" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div class="image-container">' +
        '<img id="img-' + ++c + '" class="image-cropp" src="'+isSession(fileName)+'" crossOrigin="Anonymous">' +
        '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-warning rotate-left"><span class="fa fa-undo"></span></button>' +
        '<button type="button" class="btn btn-warning rotate-right"><span class="fa fa-undo" style="-ms-transform: rotate(180deg);-webkit-transform: rotate(180deg);transform: rotate(180deg);"></span></button>' +
        '<button type="button" class="btn btn-warning scale-x" data-value="-1"><span class="fas fa-long-arrow-alt-left"></span><span class="fas fa-long-arrow-alt-right"></span></button>' +
        '<button type="button" class="btn btn-warning scale-y" data-value="-1"><span class="fas fa-long-arrow-alt-up"></span><span class="fas fa-long-arrow-alt-down"></span></button>' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
        '<button type="button" class="btn btn-primary crop-upload">Enregistrer</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    var $cropperModal = $(modalTemplate);

    $cropperModal.modal('show').on("shown.bs.modal", function () {
        var cropper = new Cropper(document.getElementById('img-' + c), {
            autoCropArea: 1,
            movable: false,
            cropBoxResizable: true,
            rotatable: true
        });
        var $this = $(this);
        $this
            .on('click', '.crop-upload', function () {
                // get cropped image data
                var blob = cropper.getCroppedCanvas().toDataURL("image/png");
                // transform it to Blob object
                var croppedFile = dataURItoBlob(blob);
                croppedFile.name = c+fileName;

                myDropzone.addFile(croppedFile);
                $this.modal('hide');
            })
            .on('click', '.rotate-right', function () {
                cropper.rotate(90);
            })
            .on('click', '.rotate-left', function () {
                cropper.rotate(-90);
            })
            .on('click', '.reset', function () {
                cropper.reset();
            })
            .on('click', '.scale-x', function () {
                var $this = $(this);
                cropper.scaleX($this.data('value'));
                $this.data('value', -$this.data('value'));
            })
            .on('click', '.scale-y', function () {
                var $this = $(this);
                cropper.scaleY($this.data('value'));
                $this.data('value', -$this.data('value'));
            });
    });
});

function RemoveAccents(strAccents) {
    var strAccents = strAccents.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
        } else {
            strAccentsOut[y] = strAccents[y];
        }
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
}