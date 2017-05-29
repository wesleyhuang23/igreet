<template>
    <div class="todo">
        <span>Todo</span>
    </div>
</template>

<script>
export default {
    name: 'Todo',
    data () {
        return {
            
        }
    }
}
</script>

<style lang="scss">
    .todo{
        position: absolute;
        bottom: 25px;
        right: 20px;


        span{
            opacity: 0.6;
            color: white;
            font-weight: bolder;
            cursor: pointer;

            &:hover{
                opacity: 1;
            }
        }
    }
</style>