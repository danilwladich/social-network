const fs = require("fs");

fs.access("./production", (err) => {
	if (!err) {
		fs.rmSync("./production", { recursive: true });
	}
});
