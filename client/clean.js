const fs = require("fs");
const fse = require("fs-extra");

fs.access("./production/static/js", (err) => {
	if (!err) {
		fs.rmSync("./production/static/js", { recursive: true });
	}
});
fs.access("./production/static/css", (err) => {
	if (!err) {
		fs.rmSync("./production/static/css", { recursive: true });
	}
});

setTimeout(() => {
	fse.copySync("./build", "./production", { overwrite: true });
}, 500);
