tinymce.init({ selector: 'textarea' });
$(document).ready(function () {
    $('.post-categories-multiple').select2();
});
$('#input-tags').selectize({
    persist: false,
    createOnBlur: true,
    create: true
});
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#post-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#post-image-input").change(function () {
    readURL(this);
});