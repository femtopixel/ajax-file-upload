/**
* options: 	onComplete 	: function called when file upload is finished
						onStart			:	function called when file upload start
						multiple		:	bool that add a new ajax fileupload when submitting a file
						loadingText : text shown when uploading a file (<name> shows the filename)
						finishText : text shown when uploading a file (<name> shows the filename)
						
	== Aditional informations ==
	
	you can access the id of the instance with this.id in the callback functions
*/
Ajax.FileUpload = Class.create();
Ajax.FileUpload.prototype =
{
  initialize: function(element, url, options) {
    this.url = url;
    this.element = element = $(element);
		
		this.options = {
			loadingText: 'Uploading <name>',
			finishText: '<name> uploaded !',
			multiple:true
		}
		if (options)
			this.options = Object.extend(this.options, options);
		this.createInstance();
  },
  createInstance: function() {
		this.id = Math.ceil(Math.random() * 99999);
    this.options.id = this.id;
    this.createInfo();
    this.createMyIframe();
    this.createMyForm();
    return (this.id);
  },
  createInfo:	function () {
  	if (typeof(this.info) == "undefined")
    {
			this.info = document.createElement('div');
			this.info.id = "ajaxfileupload_infos";
			this.updateInfo("");
			this.element.appendChild(this.info);
    }
  },
  createMyIframe:	function () {
		if (typeof(this.iframe) == "undefined")
    {
			this.span = document.createElement('span');
			this.iframe = document.createElement('iframe');
			this.iframe.id = 'ajaxfileupload_iframe_'+this.id;
			this.iframe.src = 'about:blank';
			this.iframe.name = 'ajaxfileupload_iframe_'+this.id;
			this.iframe.style.display = 'none';
			this.iframe.appendChild(this.span);
			this.element.appendChild(this.iframe);
		}
  },
  createMyForm: function () {
		if (typeof(this.form) == "undefined")
    {
			this.form = document.createElement('form');
			this.form.method = 'POST';
			this.form.action = this.url;
			this.form.target = 'ajaxfileupload_iframe_'+this.id;
			this.form.id = 'ajaxfileupload_form_'+this.id;
			this.form.className = "ajaxfileupload_form";
			this.form.enctype = 'multipart/form-data';
				 
			this.file = document.createElement('input');
			this.file.type='file';
			this.file.name='file';
			this.file.className='ajaxfileupload_file';
			this.file.id = 'ajaxfileupload_file_'+this.id;
			this.setOnStart();	
			this.form.appendChild(this.file);
			this.element.appendChild(this.form);
		}
  },
  setOnStart: function () {
		this.file.onchange = (function ()
		{
			this.onStart();
			this.setOnComplete();
		}).bind(this);
  },
  setOnComplete: function() {
		this.iframe.onload = (function () {
				this.onComplete();
				if (typeof(this.options.onComplete) == "function")
					this.options.onComplete();
			}).bind(this);
	},
  getFilename: function() {
		var b = this.file.value.replace(/^.*[\/\\]/g, '');
		return b;
	},
	updateInfo: function (inbody) {
		if (typeof(this.myinfo) == "undefined")
		{
			this.myinfo = document.createElement('div');
			this.myinfo.id = 'ajaxfileupload_div_'+this.id;
			this.myinfo.className = "ajaxfileupload_div";
			this.myinfo.style.display = "none";
			this.info.appendChild(this.myinfo);
		}
		else
		{
			this.myinfo.style.display = "block";
			text = inbody.replace("<name>", this.getFilename());
			this.myinfo.innerHTML = text;
		}
	},
	
	onStart: function () {
		this.form.style.display = 'none';
		if (typeof(this.options.onStart) == "function")
				this.options.onStart();
		this.form.submit();
		this.form.style.display = 'none';
		this.updateInfo(this.options.loadingText);
		if (this.options.multiple == true)
		{
			new Ajax.FileUpload(this.element, this.url, this.options);
		}
  },
  
  onComplete: function () {
		this.updateInfo(this.options.finishText)
  }
}