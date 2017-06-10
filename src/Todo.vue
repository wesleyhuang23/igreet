<template>
    <div>
        <div class="todo" v-on:click="showTodo()">
            <span>Todo</span>
        </div>
        <div class="todo-content">
            <ol v-if="show" class="todo-list">
                <li v-for="todo in todoItems">
                    <input type="checkbox" id="todoItem"><label for="subscribeNews">{{todo}}</label><div id="deleteTodo" v-on:click="removeTodo(todoItems.indexOf(todo))"><div>&#215;</div></div>
                </li>
            </ol>
            <div v-else class="list-placeholder">    
                <div class="graphic">☺</div>
                <div class="title">Nothing to do</div>
                <div class="description">Add a todo to get started, {{user}}</div>
            </div>
            <input type="text" placeholder="New Todo" v-on:keyup="addTodo(todos, $event)" v-model="todos"/>
            <div v-show="!show" class="action">
                <span class="completed">Completed today</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Todo',
    props: ['user'],
    data () {
        return {
            todoItems: [],
            show: false,
            todos:''
        }
    },
    methods: {
        showTodo: function(){ //hide and show effect of todo
            let todo = document.getElementsByClassName('todo-content')[0];
            if(todo.style.opacity == '0'){
                todo.style.opacity = '1';
                todo.style.transform = 'translateY(-5px)';
            } else if(todo.style.opacity = '1') {
                todo.style.opacity = '0';
                todo.style.transform = 'translateY(5px)';
            }
        },
        addTodo: function(todo, event){
            if(event.keyCode == 13){
                this.todoItems.push(todo);
                this.show = true;
                this.todos = '';
                localStorage.todos = JSON.stringify(this.todoItems);
                // console.log(this.todoItems);
            }
        },
        removeTodo: function(todoIndex){
            this.todoItems.splice(todoIndex, 1);
            if(this.todoItems.length == 0){
                this.show = false;
            }
            localStorage.todos = JSON.stringify(this.todoItems);
        },
    },
    created: function(){
        setTimeout(()=>{
            if(localStorage.todos.length > 2){
                this.show = true;
            }
            this.todoItems = JSON.parse(localStorage.todos);
            console.log(this.todoItems);
        }, 3000)
        
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
    .todo-content{
        position: absolute;
        bottom: 50px;
        right: 2px;
        width: 270px;
        height: auto;
        padding: 15px;
        background-color: rgba(0,0,0, .8);
        background-clip: padding-box;
        border: 3px solid transparent;
        border-radius: 7px;
        text-align: center;
        color: white;
        opacity: 0;
        transform: translateY(5px);
        transition: all 0.4s;

        .list-placeholder{
            height: 150px;
            display: flex;
            align-items: center;
            flex-direction: column;
            padding-top: 20px;
        }
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
        ol{
            list-style: none;
            position: relative;
            // border: 1px solid red;
            margin-bottom: 25px;

            li{
                padding-top: 5px;
                padding-bottom: 5px;
                // border: 1px solid green;
                text-align: justify;
                width: 117%;
                margin-left: -40px;

                input{
                    position: relative;
                    display: inline-block;
                    bottom: 0;
                    left: 0;
                    width: 10px;
                    top: 2.5px;
                }

                label{
                    margin-left: 8px;
                }

                #deleteTodo{
                    margin-left: 250px;
                    margin-top: -18px;
                    position: relative;
                    text-align: right;
                    cursor: pointer;

                    div{
                        width: 20px;
                        height: 20px;
                        display: flex;
                        justify-content: center;

                        &:hover{
                            border: 1px solid white;
                            border-radius: 50px;
                        }
                    }
                }
            }
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