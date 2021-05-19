import React from 'react';
//import './App.css';
import { Button, Flex, Input, Header } from '@fluentui/react-northstar'
import { PlayIcon, MicIcon } from '@fluentui/react-icons-northstar'

class GenerateURL extends React.Component {
    render () {
        return (
            <div>
                <header>
                    This is my website!
                </header>

                <main>
                    {this.props.children}
                </main>

                <footer>
                    Your copyright message
                </footer>
            </div>
        );
    }
}
export default GenerateURL;