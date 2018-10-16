import React, { Component } from 'react';
import 'bizcharts/lib/core';
import Chart from 'bizcharts/lib/components/Chart';
import Axis from 'bizcharts/lib/components/Axis';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Interval from 'bizcharts/lib/components/TypedGeom/Interval';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class Bar extends Component {
    state = {
        autoHideXLabels: false,
    };

    componentDidMount() {
        window.dispatchEvent(new Event('resize'));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    handleRoot = n => {
        this.root = n;
    };

    handleRef = n => {
        this.node = n;
    };

    @Bind()
    @Debounce(400)
    resize() {
        if (!this.node) {
            return;
        }
        const canvasWidth = this.node.parentNode.clientWidth;
        const { data = [], autoLabel = true } = this.props;
        if (!autoLabel) {
            return;
        }
        const minWidth = data.length * 30;
        const { autoHideXLabels } = this.state;

        if (canvasWidth <= minWidth) {
            if (!autoHideXLabels) {
                this.setState({
                    autoHideXLabels: true,
                });
            }
        } else if (autoHideXLabels) {
            this.setState({
                autoHideXLabels: false,
            });
        }
    }

    render() {
        const {
            height,
            title,
            forceFit = true,
            data,
            color = 'rgba(24, 144, 255, 0.85)',
            padding,
        } = this.props;

        const { autoHideXLabels } = this.state;

        const scale = {
            x: {
                type: 'cat',
            },
            y: {
                min: 0,
            },
        };

        const tooltip = [
            'x*y',
            (x, y) => ({
                name: x,
                value: y,
            }),
        ];

        return (
            <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
                <div ref={this.handleRef}>
                    {title && <h4 style={{ marginBottom: 20 }}>{title}</h4>}
                    <Chart
                        scale={scale}
                        height={title ? height - 41 : height}
                        forceFit={forceFit}
                        data={data}
                        padding={padding || 'auto'}
                    >
                        <Axis
                            name="x"
                            title={false}
                            label={autoHideXLabels ? false : {}}
                            tickLine={autoHideXLabels ? false : {}}
                        />
                        <Axis name="y" min={0} />
                        <Tooltip showTitle={false} crosshairs={false} />
                        <Interval position="x*y" color={color} tooltip={tooltip} />
                    </Chart>
                </div>
            </div>
        );
    }
}

export default Bar;
