const projectModel = require('../models/projectModel.js');
const projectObj = {
  /**
   * 增加一个项目
   *
   */
  * add() {
    const param = this.request.body;
    const project = yield new projectModel(param).save();
    console.log('project');
    console.log(project);
    this.body = project;
  },
  /**
   * 展示项目列表
   *
   */
  * list() {
    const list = yield projectModel.find({}).sort({ _id: -1 }).exec((err, data) => {
      if (err) this.body = err;
      this.body = data;
    });
  },
};
module.exports.add = projectObj.add;
module.exports.list = projectObj.list;