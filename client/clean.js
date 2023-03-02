const fs = require("fs");
const fse = require("fs-extra");

fs.access("./production/static", (err) => {
	if (!err) {
		fs.rmSync("./production/static", { recursive: true });
	}
});

setTimeout(() => {
	fse.copySync("./build", "./production", { overwrite: true });
}, 500);
