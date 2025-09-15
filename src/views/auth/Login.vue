
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
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const userAllList = ref([]);

const initialValues = ref({
    email: '',
    password: ''
});

onMounted(async () => {
    const { data } = await axios.get('/json/user.json');
    console.log(data);
    userAllList.value = data;
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
    // console.log(valid)
    console.log(data);
    console.log(initialValues.value);

    if (!data.valid) {
        return;
    }

    console.log('ok');
    try {
        const { email, password } = initialValues.value;

        const filterUser = userAllList.value.filter((item) => item.email == email);
        console.log(filterUser)

        if (filterUser.length) {
            if (filterUser[0].password == password) {
                router.push('/PublicHealth');
                localStorage.setItem('user',JSON.stringify(filterUser[0]))
            } else {
                toast.add({ severity: 'warn', summary: 'Tips', detail: 'Incorrect password', life: 3000 });
            }
        } else {
            toast.add({ severity: 'warn', summary: 'Tips', detail: 'The email address does not exist.', life: 3000 });
        }
    } catch (err) {
        console.log(err);
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
