import Vue from 'vue'
import { Button, Form, FormItem, Input ,Message} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// Message 与上面的不同，需要全局挂在到Vue原型上
Vue.prototype.$message = Message
