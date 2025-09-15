<template>
    <div class="bg">
        <!-- <FloatingConfigurator /> -->

        <div class="gradient-bg flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex w-full flex-col items-center justify-center">
                <div class="w-full sm:w-[400px] bg-surface-0 dark:bg-surface-900 py-10 px-10" style="border-radius: 10px">
                        <slot></slot>
                    </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.bg {
    background-image: url(./123.jpg);
    background-size: 100% 100%;
    width: 100vw;
    height: 100vh;

    .gradient-bg {
        background: radial-gradient(black, transparent);
    }
}
</style>
