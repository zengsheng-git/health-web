<template>
    <AnthLayout>
        <div class="text-center mb-8">
            <!-- <img src="/public/favicon.ico" class="mb-8 w-16 shrink-0 mx-auto" /> -->
            <!-- <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Information technology Website</div> -->
            <span class="text-2xl"> Create an Account </span>
        </div>

        <div>
            <Form v-slot="$form" :resolver :validateOnValueUpdate="true" :validateOnBlur="true" :validateOnMount="['firstName']" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
                <div class="flex flex-col gap-4">

                    <div class="flex flex-col relative">
                        <label for="email" class="block text-surface-900 dark:text-surface-0 font-medium text-lg mb-2">Email</label>
                        <InputText class="" name="email" v-model="initialValues.email" placeholder="Email" type="text" fluid />
                        <Message v-if="$form.email?.invalid" severity="error" variant="simple" class="">
                            {{ $form.email?.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col relative">
                        <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-lg mb-2">Password</label>
                        <Password inputClass="" name="password" v-model="initialValues.password" placeholder="Password" fluid toggleMask :feedback="false" />
                        <Message v-if="$form.password?.invalid" severity="error" variant="simple" class="">
                            {{ $form.password?.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col relative">
                        <label for="ConfirmPassword" class="block text-surface-900 dark:text-surface-0 font-medium text-lg mb-2">Confirm password</label>
                        <Password
                            inputClass=""
                            @value-change="onChangeConfirmPassword"
                            name="ConfirmPassword"
                            v-model="initialValues.ConfirmPassword"
                            placeholder="Confirm password"
                            fluid
                            toggleMask
                            :feedback="false"
                        />
                        <Message v-if="$form.ConfirmPassword?.invalid" severity="error" variant="simple" class="">
                            {{ $form.ConfirmPassword?.error?.message }}
                        </Message>
                    </div>

            

                    <div class="flex flex-col relative">
                        <label for="GivenName" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2">Given Name</label>
                        <InputText class="" name="GivenName" v-model="initialValues.GivenName" placeholder="Given Name" type="text" fluid />
                        <Message v-if="$form.GivenName?.invalid" severity="error" variant="simple" class="">
                            {{ $form.GivenName?.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col relative">
                        <label for="FamilyName" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2">Family Name</label>
                        <InputText class="" name="FamilyName" v-model="initialValues.FamilyName" placeholder="Family Name" type="text" fluid />
                        <Message v-if="$form.FamilyName?.invalid" severity="error" variant="simple" class="">
                            {{ $form.FamilyName?.error?.message }}
                        </Message>
                    </div>

                    
                </div>

                <div class="mt-4">
                    <Button type="submit" label="Register" class="w-full"></Button>

                    <div class="mt-4">
                        Already have an account?
                        <RouterLink to="/auth/login" class="font-bold text-[var(--primary-color)]">Login</RouterLink>
                    </div>
                </div>
            </Form>
        </div>
    </AnthLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
import AnthLayout from "./anthLayout.vue";
import { ref } from "vue";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/common/firebase";
import { useToast } from "primevue/usetoast";
import { isEmail } from "@/common/util";
import { RouterLink } from "vue-router";
const router = useRouter();
const toast = useToast();

const initialValues = ref({
    email:'',
    password:'',
    ConfirmPassword:'',
    GivenName:'',
    FamilyName:''

});


function validateName(name) {
    // Check if the length is between 3 and 20
    if (name.length < 3 || name.length > 20) {
        return false;
    }
    
    // Regular expression: only letters (including uppercase and lowercase) are allowed
    const nameRegex = /^[A-Za-z]+$/;
    // Test if the name matches the regular expression
    return nameRegex.test(name);
}

const resolver = ({ values }) => {
    console.log(values);
    console.log(initialValues.value);
    // console.log(initialValues.value.ConfirmPassword!==initialValues.value.password);
    const errors = {};

    
    if (!initialValues.value.email) {
        errors.email = [{ message: "Email is required." }];
    }

    if (!isEmail(initialValues.value.email)) {
        errors.email = [{ message: "Please enter a valid email address." }];
    }

    if (!initialValues.value.password) {
        errors.password = [{ message: "Password is required." }];
    }

    if (initialValues.value.password.length<6) {
        errors.password = [{ message: "Password is too short (minimum is 6 characters)." }];
    }

    if (!initialValues.value.ConfirmPassword) {
        errors.ConfirmPassword = [{ message: "Confirm Password is required." }];
    }

    if (initialValues.value.ConfirmPassword !== initialValues.value.password) {
        errors.ConfirmPassword = [{ message: "The two passwords are different." }];
    }

    if ( !validateName (initialValues.value.GivenName)) {
        errors.GivenName = [{ message: "Given Name input can only contain letters (a-z,A-Z). The name length must be between 3 and 20 characters." }];
    } 
    if ( !validateName (initialValues.value.FamilyName)) {
        errors.FamilyName = [{ message: "Family  Name input can only contain letters (a-z,A-Z). The name length must be between 3 and 20 characters." }];
    } 


    return {
        errors,
    };
};

const onChangeConfirmPassword = (val) => {
    console.log(val);
};



const onFormSubmit = async (data) => {
    if (!data.valid) return;

    try {
        const { email, password, GivenName, FamilyName } = initialValues.value;
        const displayName = [GivenName, FamilyName].filter(Boolean).join(' ');

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // 设置显示名称
        if (auth.currentUser && displayName) {
            await updateProfile(auth.currentUser, { displayName });
        }

        // 将用户信息存入本地（可按需改为注册成功后直接登录或跳转到登录页）
        const user = userCredential.user;
        const userPayload = {
            uid: user.uid,
            email: user.email,
            displayName: displayName || user.displayName || '',
        };
        localStorage.setItem('user', JSON.stringify(userPayload));

        toast.add({ severity: 'success', summary: 'Success', detail: 'Registration successful', life: 2000 });
        // 注册后跳转到首页或登录页
        router.push('/PublicHealth');
    } catch (err) {
        console.error(err);
        let detail = 'Registration failed';
        if (err?.code === 'auth/email-already-in-use') {
            detail = 'Email already in use';
        } else if (err?.code === 'auth/weak-password') {
            detail = 'Password is too weak';
        }
        toast.add({ severity: 'warn', summary: 'Tips', detail, life: 3000 });
    }
};


</script>

<style scoped></style>
