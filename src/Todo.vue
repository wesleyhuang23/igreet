<template>
    <div>
        <div class="todo">
            <span>Todo</span>
        </div>
        <div class="todo-list">
            <div class="graphic">☺</div>
        </div>
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
        z-index: 5;
        user-select: none;


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
    .todo-list{
        position: absolute;
        bottom: 50px;
        right: 5px;
        width: 270px;
        height: 170px;
        padding: 15px;
        background-color: rgba(255,255,255, .5);
        background-clip: padding-box;
        border: 3px solid transparent;
        border-radius: 7px;
    }
</style>