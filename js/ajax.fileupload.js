/**
* options: 	onComplete 	: function called when file upload is finished
						onStart			:	function called when file upload start
						multiple		:	bool that add a new ajax fileupload when submitting a file
						loadingText : text shown when uploading a file (<name> shows the filename)
						finishText : text shown when uploading a file (<name> shows the filename)
						
	== Aditional informations ==
	
	you can access the id of the instance with this.id in the callback functions
	
	this version doesn't take of the success/failure of the upload
	
	== Exemple ==
	
	<div id='fileupload'></div>
	<script type='text/javascript'>
		test = new Ajax.FileUpload('fileupload', 'ajax/fileupload.php');
	</script>
	
	@todo see for design problems and get return to know if upload is ok
*/
Ajax.FileUpload = Class.create();
Ajax.FileUpload.complete = Array();
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
			this.iframeaccess.innerHTML = "<iframe id='ajaxfileupload_iframe_"+this.id+"' onload='Ajax.FileUpload.complete["+this.id+"]();' name='ajaxfileupload_iframe_"+this.id+"' style='display:none;width:0px;height:0px;visibility:hidden'></iframe>";
			this.iframe = $("ajaxfileupload_iframe_"+this.id);
		}
  },
  createMyForm: function () {
		if (typeof(this.form) == "undefined")
    {
			newelement = document.createElement('div');
			newelement.innerHTML = "<div id='ajaxfileupload_accessor_"+this.id+"'></div><form method='post' action='"+this.url+"' target='ajaxfileupload_iframe_"+this.id+"' id='ajaxfileupload_form_"+this.id+"' enctype='multipart/form-data'><input type='file' name='file' id='ajaxfileupload_file_"+this.id+"'/></form>"
			this.element.appendChild(newelement);
			this.form = $("ajaxfileupload_form_"+this.id);
			this.file = $("ajaxfileupload_file_"+this.id);
			this.iframeaccess = $("ajaxfileupload_accessor_"+this.id);
			this.setOnStart();
		}
  },
  setOnComplete : function () {
		Ajax.FileUpload.complete[this.id] = (function () {
				this.onComplete();
				if (typeof(this.options.onComplete) == "function")
					this.options.onComplete();
		}).bind(this);
	},
  setOnStart: function () {
		this.file.onchange = (function ()
		{
			this.setOnComplete();
			this.createMyIframe();
			this.onStart();
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
			this.myinfo.style.display = "inline";
			text = inbody.replace("<name>", this.getFilename());
			this.myinfo.innerHTML = text;
		}
	},
	
	onStart: function () {
		this.form.style.display = 'none';
		this.form.style.visibility = 'hidden';
		this.form.style.width = '0px';
		this.form.style.height = '0px';
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