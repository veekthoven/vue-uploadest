<script>
	import Vue from 'vue';
	import Dropzone from 'dropzone';
	Dropzone.autoDiscover = false;
	export default Vue.component(
		'vue-uploadest',
		{
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
					default: '#button'
				},
				id: { // Area that the file to be uploaded can be dropped
					type: String,
					default: '#dropzone'
				},
				accept: { // accepted file mime type or extension. array if multiple, string if single
					type: String,
					default: null
				},
				formData: { // Form data to be sent along with the file
					type: Object,
					required: false,
					default: () => {
						return {}
					}
				}
			},
			data () {
				return {
					uploading: false,
					progress: 0,
					error: '',
					imgSrc: '',
					successful: false
				}
			},
			render () {
				return this.$scopedSlots.default({
					uploading: this.uploading,
					progress: this.progress,
					error: this.error,
					bgImg: this.bgImg,
					successful: this.successful
				});
			},
			mounted() {
				new Dropzone(this.id, { 
					url: this.action,
					paramName: this.name,
					clickable: document.querySelector(this.clickable),
					acceptedFiles: this.accept,
					previewsContainer: false,
					headers: {
						'Accept': 'application/json'
					},
					params: this.formData
				})
				.on('addedfile', () => {
					this.uploading = true;
				})
				.on('uploadprogress', (file, progress) => {
					this.progress = progress;
				})
				.on("success", (file, response) => {
					this.$emit('success', response);
					this.successful = true;
					this.uploading = false;
				})
				.on("thumbnail", (file, dataURL) => {
					this.imgSrc = dataURL;
				})
				.on('error', (file, response) => {
					this.$emit('error', response)
					this.successful = false
					this.uploading = false
				});
			}
		}
	);
</script>