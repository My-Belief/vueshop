module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {	
		"arrow-parens":0,
		"genertor-star-spacing":0,
		 // 'space-before-function-paren':0,
		"no-mixed-spaces-and-tabs":0,
		"no-debugger":process.env.NODE_ENV==='prodection'?2:0,
		"no-unused-vars":"off"
		
	}
		
    
};