<template>
  <van-popup v-model:show="props.show" closeable :close-on-click-overlay="false" :style="{ width: '78%', minHeight: '275px', paddingTop: '32px' }" @click-close-icon="handleClose" @open="openCallback">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <template v-if="isPsdLogin">
          <van-field
            v-model.trim="loginForm.identifier"
            name="identifier"
            label=""
            maxlength="11"
            placeholder="手机/邮箱/用户名"
            autocomplete="off"
            :rules="[{ required: true, message: '请输入手机/邮箱/用户名' }]"
            @input="
              loginForm.identifier = loginForm.identifier.replace(/[^\a-zA-Z0-9~!@#$%^&*()_+-=[/];'\,./g, '');
              if (loginForm.identifier.length > 100) loginForm.identifier = loginForm.identifier.slice(0, 100);
            "
          />
          <van-field
            v-if="captchaFlag"
            v-model.trim="loginForm.captcha_code"
            name="captcha_code"
            label=""
            clearable
            maxlength="4"
            placeholder="图形验证码"
            autocomplete="off"
            :rules="[{ required: true, message: '请输入图形验证码' }]"
            @focus="refreshCaptcha"
          >
            <template #button>
              <van-image width="100%" height="34px" fit="fill" class="captcha-box" :src="captchaSrc" @click="getCaptcha"/>
            </template>
          </van-field>
          <van-field
            v-model.trim="loginForm.password"
            type="password"
            name="password"
            label=""
            placeholder="密码"
            autocomplete="off"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </template>
        <template v-else>
          <van-field
            v-model.trim="loginForm.phone"
            name="phone"
            label=""
            maxlength="11"
            placeholder="手机"
            autocomplete="off"
            :rules="[{ required: true, message: '请输入手机' }, {pattern, message: '请输入正确的手机号'}]"
          />
          <van-field
            v-model.trim="loginForm.code"
            name="code"
            label=""
            clearable
            maxlength="6"
            placeholder="验证码"
            autocomplete="off"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-button class="verify-code-btn" size="small" type="default" :disabled="remainTime > 0" @click="get_verify_code">
                {{ remainTime ? `${remainTime < 10 ? `0${remainTime}` : remainTime}s` : '获取验证码' }}
              </van-button>
            </template>
        </van-field>
        </template>
      </van-cell-group>
      <div class="login-btn-box">
        <p class="login-rule"><van-checkbox v-model="checked" shape="square" icon-size="12px">已阅读并同意</van-checkbox><span @click="openProtocol('userAgreement')">《用户协议》</span>和<span @click="openProtocol('privacyPolicy')">《隐私政策》</span></p>
        <van-button block type="primary" native-type="submit" class="login-btn" :loading="logining">
          登录
        </van-button>
        <p class="switch-type-box" @click="handleSwitch">{{isPsdLogin ? '手机登录' : '密码登录'}}</p>
      </div>
    </van-form>
    <van-popup v-model:show="protocolShow" closeable teleport="body" :style="{ width: '100%', maxWidth: '100vh', paddingTop: '35px', overflow: 'hidden' }">
      <protocol :type="protocolName" />
    </van-popup>
  </van-popup>
</template>

<script lang="ts" setup>
import { showConfirmDialog } from 'vant'
import { JSEncrypt } from 'jsencrypt'
import { localStorage } from '@/utils/local-storage'
import apis from '@/api'

const RESEND_TIME: number = 120
const pattern = /^1[3456789]\d{9}$/
const router = useRouter()

const props = defineProps({
  show: {
    type: Boolean,
    require: true
  }
})
// const switchShow = inject('switchShow', Function, false)
const emits = defineEmits(['update:show'])
let loginForm = reactive({
  identifier: '',
  captcha_code: '',
  password: '',
  phone: '',
  code: ''
})
const activeTab = ref('phone')
const remainTime = ref(0)
const publicKey = ref('')
const checked = ref(true)
const captchaFlag = ref(false)
const logining = ref(false)
const captchaTime = ref(0)
const captcha_id = ref('')
const captchaSrc = ref('')
const isPsdLogin = computed(() => activeTab.value === 'psd')
const protocolShow = ref(false)
const protocolName = ref('')

const handleSwitch = () => {
  activeTab.value = isPsdLogin.value ? 'phone' : 'psd'
  get_public_key()
}

// 密码登录获取公钥
const get_public_key = () => {
  if(isPsdLogin.value) {
    if(publicKey.value) return
    apis.getPublicKey().then(({code, data}) => {
      if(code != 200) return
      publicKey.value = data.public_key
    })
  }
}

// 获取验证码
const get_verify_code = () => {
  if(pattern.test(loginForm.phone)) {
    apis.getLoginVerifyCode({
      identifier: loginForm.phone
    }).then(({code}) => {
      if(code != 200) return
      remainTime.value = RESEND_TIME
      calculateTime(remainTime.value)
    })
  }  
}

// 倒计时计算
const calculateTime = (time: number) => {
  let timer = null
  timer = setInterval(() => {
    if(time <= 1) {
      clearInterval(timer)
    }
    remainTime.value = --time
  }, 1000)
}

// 获取图片验证码
const getCaptcha = () => {
  let captchaOption: any = null
  apis.get_captcha_id().then(res => {
    if (res.data && res.data.id) {
      captchaOption = {
        ts: new Date().getTime(), // 当前时间戳
        id: res.data.id,
        url: `/api/connection/v1/captcha?id=${res.data.id}`
      }
    }
    setCaptcha(captchaOption)
  })
}

const setCaptcha = (data) => {
  if (data.id) {
    captchaTime.value = data.ts
    captcha_id.value = data.id
    captchaSrc.value = data.url
  }
}

// 刷新图片验证码
const refreshCaptcha = () => {
  let captchaTimeTmp = captchaTime.value
  // 获取当前时间
  let timestamp = new Date().getTime();
  if (timestamp - captchaTimeTmp > 1000) {
    // 1 分钟 可自行配置
    getCaptcha();
  }
}

// 登录
const onSubmit = () => {
  logining.value = true
  const { identifier, password, captcha_code, phone, code } = loginForm
  if(isPsdLogin.value) {// 密码登录
    let encryptPsd: string | boolean
    // 密码加密
    if(publicKey.value) {
      const encrypt = new JSEncrypt({default_key_size: '2048'})
      encrypt.setPublicKey(publicKey.value)
      encryptPsd = encrypt.encrypt(password)
    }

    const params = {
      identifier,
      password: encryptPsd || password,
      captcha_id: captchaFlag.value ? captcha_id.value : undefined,
      captcha_code
    }
    apis.post_login(params).then(res => {
      loginCallBack(res)
    })
  } else {// 验证码登录
    const params = {
      identifier: phone,
      verify_code: code
    }
    apis.verifyCodeLogin(params).then(res => {
      loginCallBack(res)
    })
  }
}

// 登录成功
const loginCallBack = (res) => {
  if (res.code === 200) {
    handleClose()
    localStorage.set('session_token', res.data.session_token)
    setTimeout(() => {
      get_userProfile()
    }, 500)
    showConfirmDialog({
      title: '恭喜您登录成功！',
      message: '芯之元APP，提供内容浏览、商户管理、供求买卖、电子钱包、订单跟踪等丰富功能，欢迎下载体验！',
      messageAlign: 'left',
      confirmButtonText: '立即前往',
      cancelButtonText: '残忍拒绝'
    })
      .then(() => {
        router.push('/app-download')
      })
      .catch(() => {
        // router.push('/')
        // 刷新为了同域名下页面能获取到存储的localStorage数据
        window.location.reload()
      })
  } else if (res.code === 403) {// 需要图片验证码
    getCaptcha()
    captchaFlag.value = true
  }
  logining.value = false
}

// 获取登录信息
const get_userProfile = () => {
  apis.get_users_traits().then(userProfile => {
    if (userProfile) {
      localStorage.set('profile', userProfile)
    }
  })
}

// 关闭前清空
const openCallback = (): void => {
  activeTab.value = 'phone'
  loginForm.identifier = ''
  loginForm.captcha_code = ''
  loginForm.password = ''
  loginForm.phone = ''
  loginForm.code = ''
}

// 关闭
const handleClose = (): void => {
  emits('update:show', false)
}

const openProtocol = (name: string): void => {
  protocolShow.value = true
  protocolName.value = name
}
</script>

<style lang="less" scoped>
// :global(.van-popup__close-icon) {
//   top: 10px;
//   right: 8px;
//   font-size: 16px;
// }
:deep(.van-field__body) {
  border: 1px solid @lc;
  padding: 4px;
  height: 38px;
}
.van-field {
  padding: 0 10px;
  height: 64px;
}
.van-cell-group--inset {
  margin: 0 10px;
}
:deep(.van-checkbox__icon--checked .van-icon) {
  background-color: @icColor;
  border-color: @icColor;
}
.captcha-box {
  top: 3px;
}
.verify-code-btn{
  width: 80px;
  top: -1px;
  height: 30px;
  line-height: 30px;
  color: @icColor;
}
.login-btn-box {
  margin: 0 18px;
  .login-rule {
    display: flex;
    font-size: 12px;
    color: @fc9;
    span {
      color: @icColor;
    }
  }
  .login-btn {
    margin-top: 15px;
  }
  .switch-type-box {
    margin: 10px 0;
    font-size: 14px;
    color: @fc6;
  }
}
</style>