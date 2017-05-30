<template>
    <div>
        <div class="todo">
            <span>Todo</span>
        </div>
        <div class="todo-content">
            <div class="graphic">☺</div>
            <div class="title">Nothing to do</div>
            <div class="description">Add a todo to get started, {{user}}</div>
            <input type="text" placeholder="New Todo"/>
            <div class="action">
                <span class="completed">Completed today</span>
            </div>
            <ol class="todo-list"></ol>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Todo',
    props: ['user'],
    data () {
        return {
            
        }
    },
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
    .todo-content{
        position: absolute;
        bottom: 50px;
        right: 2px;
        width: 270px;
        height: 170px;
        padding: 15px;
        background-color: rgba(0,0,0, .8);
        background-clip: padding-box;
        border: 3px solid transparent;
        border-radius: 7px;
        text-align: center;
        color: white;

        .graphic{
            font-size: 60px;
        }
        .title{
            font-size: 14px;
        }
        .description{
            opacity: 0.4;
            font-size: 14px;
        }
        input{
            position: absolute;
            bottom: 15px;
            left: 15px;
            width: 270px;
            height: 20px;
            border-bottom: none;
            font-size: 15px;
            text-align: left;
            font-weight: bold;
        }
    }
    .action{
        position: absolute;
        top: 5px;
        right: 15px;
        opacity: 0.5;

        span{
            font-size: 11px;
        }
    }
</style>