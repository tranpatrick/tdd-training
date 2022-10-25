import {fireEvent, render} from "@testing-library/react";
import Input from "./Input";

describe('Layout', () => {

    it('has input item', () => {
        const {container} = render(<Input/>);
        const input = container.querySelector('input');
        expect(input).toBeInTheDocument();
    })

    it('displays the label provided in props', () => {
        const { queryByText } = render(<Input label="Test Label"/>)
        const label = queryByText('Test Label');
        expect(label).toBeInTheDocument();
    })

    it('does not displays when no label is provided in props', () => {
        const { container } = render(<Input/>)
        const label = container.querySelector('label');
        expect(label).not.toBeInTheDocument();
    })

    it('has text type for input when type is not provided as prop', () => {
        const { container } = render(<Input/>)
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.type).toBe('text');
    })

    it('has text type for input when type is not provided as prop', () => {
        const { container } = render(<Input type="password"/>)
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.type).toBe('password');
    })

    it('displays placeholder when it is provided as prop', () => {
        const { container } = render(<Input placeholder="Test placeholder"/>)
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.placeholder).toBe('Test placeholder');
    })

    it('has value for input when it is provided as prop', () => {
        const { container } = render(<Input value="Test value"/>)
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('Test value');
    })

    it('has onChange callback when it is provided as prop', () => {
        const onChange = jest.fn();
        const { container } = render(<Input onChange={onChange}/>)
        const input = container.querySelector('input') as HTMLInputElement;
        fireEvent.change(input, {target: {value: 'new-input'}})
        expect(onChange).toHaveBeenCalledTimes(1);
    })

    it('has default style when there is no validation error or success', () => {
        const { container } = render(<Input/>)
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.className).toBe('form-control');
    })

    it('has success style when hasError property is false', () => {
        const { container } = render(<Input hasError={false}/>)
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.className).toBe('form-control is-valid');
    })

    it('has error style when hasError property is true', () => {
        const { container } = render(<Input hasError={true}/>)
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.className).toBe('form-control is-invalid');
    })

    it('displays the error text when it is provided', () => {
        const { queryByText } = render(<Input hasError={true} error="Cannot be null"/>)
        const input = queryByText('Cannot be null') as HTMLInputElement;
        expect(input).toBeInTheDocument();
    })

    it('does not displays the error text when hasError not provided', () => {
        const { queryByText } = render(<Input error="Cannot be null"/>)
        const input = queryByText('Cannot be null') as HTMLInputElement;
        expect(input).not.toBeInTheDocument();
    })

})