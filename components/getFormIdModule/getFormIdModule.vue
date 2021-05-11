<template>
	<form bindsubmit="formSubmit" class="layout" report-submit="true">
	    <button class="button" formType="submit" plain="true" hover-class="none">
	        <slot name="content">
	            getFormIdModules
	        </slot>
	    </button>
	  </form>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			formSubmit(e){
				// let formId = e.detail.formId
				// console.log('formId', formId)
			}
		}
	}
</script>

<style lang="less">
.layout {
    display: inline-block;
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
    font-size: inherit;
    text-align: left;
    text-decoration: none;
    line-height: inherit;
    -webkit-tap-highlight-color: transparent;
    color: inherit;
    width: 100%;
    position: relative;
}
.layout .button{
    display: inline-block;
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
    font-size: inherit;
    text-align: left;
    text-decoration: none;
    line-height: inherit;
    -webkit-tap-highlight-color: #000;
    color: inherit;
    width: 100%;
    position: relative;
}
.layout .button .fixed{
    position:relative;
    z-index: 9999;
    width: 100%;
}
.layout .button:before,.layout .button:after{
    border-width: 0;
}
</style>
