import React from 'react';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';


import NetworkStore from '../../../stores/networkEngineStore';
import NetworkActions from '../../../actions/networkEngineActions';


let If = React.createClass({
    render() {
        return this.props.test ? this.props.children : false;
    }
});


export
default React.createClass({


    getInitialState() {
        return {
            online: NetworkStore.getState().online,
            isCompatible: NetworkStore.getState().isCompatible,
            hotspot: NetworkStore.getState().hotspot,
            adaptors: NetworkStore.getState().adaptors,
            enabling: NetworkStore.getState().enabling,
            disabling: NetworkStore.getState().disabling,
        };
    },

    componentWillMount() {
        NetworkStore.listen(this.update);
    },

    componentDidMount() {
        
    },

    componentWillUnmount() {
        NetworkStore.unlisten(this.update);
    },

    update() {
        if (this.isMounted()) {
            this.setState({
                isCompatible: NetworkStore.getState().isCompatible,
                hotspot: NetworkStore.getState().hotspot,
                adaptors: NetworkStore.getState().adaptors,
                enabling: NetworkStore.getState().enabling,
                disabling: NetworkStore.getState().disabling,
            });
        }
    },


    render(Running = false) {

        if(this.state.isCompatible !== 'checking' && this.state.isCompatible){
            Running = (this.state.hotspot.Status === 'Started') ? true : false;
            
            if(Running){
                var MAC = _.result(_.find(this.state.adaptors, adaptor => {
                        return adaptor.interface === 'Microsoft Hosted Network Virtual Adapter';
                    }), 'mac');
            }

        }

        return (
            <div className="section" style={{marginTop: '-15px', height: '15px', width: '300px', left: '249px'}}>
                <h2>Wi-Fi</h2>
                <div className="adaptor">
                    <div className="sep"/>
                    <If test={(this.state.enabling || this.state.disabling || this.state.isCompatible === 'checking')}>
                        <div>

                            <span style={{color: 'rgba(251, 219, 12, 0.82)'}}>{((this.state.enabling || this.state.disabling) ? ((this.state.disabling) ? 'Disabling...' : 'Enabling...') : 'Checking...')}</span>
                            <p>Status</p>

                        </div>
                    </If>
                    <If test={(this.state.isCompatible !== 'checking' && this.state.isCompatible && !this.state.enabling)}>
                        <div>
                            <If test={(!this.state.disabling)}>
                                <div>
                                    <span style={{color: Running ? '#00B20A': '#E81123'}}>{Running ? 'Active': 'Inactive'}</span>
                                    <p>Status</p>
                                </div>
                            </If>
                            <If test={(this.state.isCompatible !== 'checking' && this.state.isCompatible && Running)}>
                                <div>
                                    <div className="sep"/>

                                    <span>{MAC}</span> 
                                    <p>MAC</p>
                                </div>
                            </If>
                            <div>
                                <div className="sep"/>

                                <span>{parseInt(this.state.hotspot['Max number of clients'])}</span>
                                <p>Max number of clients</p>
                            </div>
                            <If test={(this.state.isCompatible !== 'checking' && this.state.isCompatible && Running)}>
                                <div>
                                    <div className="sep"/>

                                    <span>{parseInt(this.state.hotspot['Number of clients'])}</span>
                                    <p>Connected clients</p>
                                </div>
                            </If>

                        </div>
                    </If>
                </div>
            </div>
        );
    }
});