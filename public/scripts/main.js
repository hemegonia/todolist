var query = document.body.querySelectorAll('button.edit, h2.edit, h1.edit');

var changeToInput = function() {
   var parent = this.parentElement;
   var href = this.getAttribute('data-href');
   var id = this.getAttribute('data-id');

   var inputHTML =
      '<form class="ui form" action="' +
      href +
      '" method="POST" ><div class="field"><input type="text" name="title" id="' +
      id +
      '-edit" value="' +
      this.innerText +
      '"></div></form >';
   parent.innerHTML = inputHTML;
   var input = document.getElementById(id + '-edit');
   input.focus();
   input.setSelectionRange(0, input.value.length);
   input.addEventListener('focusout', function() {
      input.parentElement.parentElement.submit();
   });
};

query.forEach(function(button) {
   button.addEventListener('click', changeToInput);
});

var query = document.body.querySelector('#new-item');
if (query) {
   query.addEventListener('input', function() {
      this.parentElement.previousElementSibling.classList.remove('hidden');
      this.parentElement.previousElementSibling.previousElementSibling.classList.add(
         'hidden'
      );
   });
   query.addEventListener('blur', function() {
      this.parentElement.previousElementSibling.classList.add('hidden');
      this.value = '';
      this.parentElement.previousElementSibling.previousElementSibling.classList.remove(
         'hidden'
      );
   });
}

$(document).ready(function() {
   $('.ui.dropdown').dropdown();
});
