const fs = require("fs");

const path = "./production/static";

fs.access(path, (err) => {
	if (!err) {
		fs.rmSync(path, { recursive: true });
	}
});
