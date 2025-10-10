
<template>
    <AnthLayout>
        <div class="text-center mb-8">
            <!-- <img src="/public/favicon.ico" class="mb-8 w-16 shrink-0 mx-auto" /> -->
            <!-- <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Information technology Website</div> -->
            <span class="text-2xl"> Sign in to continue </span>
        </div>

        <div>
            <Form v-slot="$form" :resolver :validateOnValueUpdate="true" :validateOnBlur="true" :validateOnMount="['firstName']" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col relative">
                        <label for="email" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2">Email</label>
                        <InputText class="" name="email" v-model="initialValues.email" placeholder="email" type="text" fluid />
                        <Message v-if="$form.email?.invalid" severity="error" variant="simple" class="absolute bottom-[-20px]">
                            {{ $form.email?.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col relative">
                        <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-lg mb-2">Password</label>
                        <Password inputClass="" name="password" v-model="initialValues.password" placeholder="Password" fluid toggleMask :feedback="false" />
                        <Message v-if="$form.password?.invalid" severity="error" variant="simple" class="absolute bottom-[-20px]">
                            {{ $form.password?.error?.message }}
                        </Message>
                    </div>
                </div>

                <div class="mt-4">
                    <Button type="submit" label="Sign In" class="w-full"></Button>

                    <div class="flex items-center justify-between mt-4 gap-8">
                        <RouterLink to="/auth/register" class="font-bold text-[var(--primary-color)]">Register</RouterLink>
                        <RouterLink to="/PublicHealth" class="font-bold text-[var(--primary-color)]"> Back</RouterLink>
                    </div>
                </div>
            </Form>
        </div>
    </AnthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AnthLayout from './anthLayout.vue';
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { isEmail } from '@/common/util';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/common/firebase';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();


const initialValues = ref({
    email: '',
    password: ''
});



const resolver = ({ values }) => {
    // console.log(values);
    // console.log(initialValues.value);
    const errors = {};

    if (!initialValues.value.email) {
        errors.email = [{ message: 'Email is required.' }];
    }

    if (!isEmail(initialValues.value.email)) {
        errors.email = [{ message: 'Please enter a valid email address.' }];
    }

    if (!initialValues.value.password) {
        errors.password = [{ message: 'Password is required.' }];
    }

    return {
        errors
    };
};

const onFormSubmit = async (data) => {
    if (!data.valid) return;

    try {
        const { email, password } = initialValues.value;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 兼容现有逻辑：存储到 localStorage
        const userPayload = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
        };
        localStorage.setItem('user', JSON.stringify(userPayload));

        toast.add({ severity: 'success', summary: 'Success', detail: 'Login successful', life: 2000 });
        router.push('/PublicHealth');
    } catch (err) {
        console.error(err);
        let detail = 'Login failed';
        if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password') {
            detail = 'Incorrect email or password';
        } else if (err?.code === 'auth/user-not-found') {
            detail = 'The email address does not exist';
        }
        toast.add({ severity: 'warn', summary: 'Tips', detail, life: 3000 });
    }
};
</script>

<style scoped lang="scss">
.inputIcon {
    position: absolute;
    z-index: 99;
    left: 10px;
    top: 10px;
}
</style>
