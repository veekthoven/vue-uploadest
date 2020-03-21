<script>
	import Dropzone from 'dropzone';
	Dropzone.autoDiscover = false;
	export default {
		name: 'vue-uploadest',
		props: {
			action: { // URL Where the request will be sent to
				type: String,
				required: true
			},
			method: { // The http method to be used
				type: String,
				default: 'POST',
				validator: function (value) {
					return ["POST", "PUT", "PATCH", "GET", "DELETE"].includes(value.toUpperCase());
				}
			},
			name: { // The name of the form field
				type: String,
				default: 'file'
			},
			clickable: { // Element that triggers the file finder
				type: String,
				default: 'button'
			},
			id: { // Area that the file to be uploaded can be dropped
				type: String,
				default: 'dropzone'
			},
			accept: { // accepted file mime type or extension. array if multiple, string if single
				type: String,
				default: null //Accept every type of file
			},
			formData: { // Form data to be sent along with the file
				type: Object,
				required: false,
				default: () => {
					return {}
				}
			},
			headers: {
				type: Object,
				required: false,
				default: () => {
					return {}
				}
			},
			uploadMultiple: {
				type: Boolean,
				default: false
			},
			maxFileSize: {
				type: Number,
				default: 256 //MB
			},
			autoStart: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				dropzone: null,
				totalProgress: 0,
				imgSrc: '',
			}
		},
		render () {
			return this.$scopedSlots.default({
				files: this.dropzone ? this.dropzone.files : [],
				totalProgress: this.totalProgress,
				error: this.error,
				imgSrc: this.imgSrc,
				removeFile: this.removeFile,
				start: this.start,
				startAll: this.startAll,
				cancel: this.cancel
			});
		},
		mounted () {
			this.dropzone = new Dropzone(`#${this.id}` , { 
				url: this.action,
				paramName: this.name,
				clickable: document.querySelector(`#${this.clickable}`) ? `#${this.clickable}` : true,
				acceptedFiles: this.accept,
				uploadMultiple: this.uploadMultiple,
				maxFilesize: this.maxFileSize,
				autoQueue: this.autoStart,
				previewsContainer: false,
				headers: {
					'Accept': 'application/json',
					...this.headers
				},
				params: this.formData
			})
			.on('addedfile', (file) => {
				this.uploading = true;
				this.$emit('fileAdded', file);
			})
			.on("success", (file, response) => {
				this.$emit('success', file, response);
			})
			.on("thumbnail", (file, dataURL) => {
				this.imgSrc = dataURL;
			})
			.on('error', (file, errorMessage, xhr) => {
				this.$emit('error', file, errorMessage, xhr)
			})
			.on('removedfile', (file) => {
				this.$emit('removedFile', file)
			})
			.on('complete', (file) => {
				this.$emit('completed', file)
			})
			.on('canceled', (file) => {
				this.$emit('canceled', file)
			})
			.on('successmultiple', (files) => {
				this.$emit('successAll', files)
			})
			.on('completemultiple', (files) => {
				this.$emit('completedAll', files)
			})
			.on('cancelmultiple', (files) => {
				this.$emit('canceledAll', files)
			})
			.on('totaluploadprogress', (progress, totalBytes, totalBytesSent) => {
				this.totalProgress = progress;
				this.$emit('progressAll', progress, totalBytes, totalBytesSent)
			})
		},
		methods: {
			removeFile(file) {
				try{
					this.dropzone.removeFile(file);
				}catch(e) {
					console.log(e.toString())
				}
			},
			cancel() {
				try{
					this.dropzone.removeAllFiles(true);
				}catch(e) {
					console.log(e.toString())
				}
			},
			startAll() {
				if (!this.dropzone.files.length) return;

				this.dropzone.files.forEach(file => {
					this.start(file);	
				});
			},
			start(file) {
				try{
					this.dropzone.enqueueFile(file);
				}catch(e) {
					console.log(e.toString())
				}
			}
		}
	}
</script>