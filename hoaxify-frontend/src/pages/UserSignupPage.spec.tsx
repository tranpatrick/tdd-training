import React from "react";
import {fireEvent, queryByPlaceholderText, render, waitFor, waitForElementToBeRemoved} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {UserSignupPage} from "./UserSignupPage";

describe('UserSignupPage', () => {

    describe('Layout', () => {

        it('has header of Sign Up', () => {
            const {container} = render(<UserSignupPage/>);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Sign Up');
        });

        it('has input for display name', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const displayNameInput = queryByPlaceholderText('Your display name');
            expect(displayNameInput).toBeInTheDocument();
        });

        it('has input for username', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const usernameInput = queryByPlaceholderText('Your username');
            expect(usernameInput).toBeInTheDocument();
        });

        it('has input for password', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();
        });

        it('has password type for password input', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText('Your password') as HTMLInputElement;
            expect(passwordInput.type).toBe('password');
        });

        it('has input for password repeat', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordRepeatInput = queryByPlaceholderText('Repeat your password');
            expect(passwordRepeatInput).toBeInTheDocument();
        });

        it('has password type for password repeat input', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordRepeatInput = queryByPlaceholderText('Repeat your password') as HTMLInputElement;
            expect(passwordRepeatInput.type).toBe('password');
        });

        it('has submit button', () => {
            const {container} = render(<UserSignupPage/>);
            const submitButton = container.querySelector('button');
            expect(submitButton).toBeInTheDocument();
        });

    })

    describe('Interactions', () => {
        const changeEvent = (content: String) => {
            return {
                target: {
                    value: content
                }
            }
        }

        let button: HTMLButtonElement;
        let displayNameInput: HTMLInputElement;
        let usernameInput: HTMLInputElement;
        let passwordInput: HTMLInputElement;
        let repeatPasswordInput: HTMLInputElement;

        const mockAsyncDelayed = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({});
                    }, 300)
                })
            })
        }

        const setupForSubmit = (props?: any) => {
            const rendered = render(<UserSignupPage {...props}/>)

            const {container, queryByPlaceholderText} = rendered;

            displayNameInput = queryByPlaceholderText('Your display name') as HTMLInputElement;
            usernameInput = queryByPlaceholderText('Your username') as HTMLInputElement;
            passwordInput = queryByPlaceholderText('Your password') as HTMLInputElement;
            repeatPasswordInput = queryByPlaceholderText('Repeat your password') as HTMLInputElement;

            fireEvent.change(displayNameInput, changeEvent('my-display-name'))
            fireEvent.change(usernameInput, changeEvent('my-username'))
            fireEvent.change(passwordInput, changeEvent('P4ssword'))
            fireEvent.change(repeatPasswordInput, changeEvent('P4ssword'))

            button = container.querySelector('button') as HTMLButtonElement;

            return rendered;
        }

        it('sets the displayName value into state', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const displayNameInput = queryByPlaceholderText('Your display name') as HTMLInputElement;
            fireEvent.change(displayNameInput, changeEvent('my-display-name'));
            expect(displayNameInput).toHaveValue('my-display-name');
        });

        it('sets the username value into state', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const usernameInput = queryByPlaceholderText('Your username') as HTMLInputElement;
            fireEvent.change(usernameInput, changeEvent('my-username'));
            expect(usernameInput).toHaveValue('my-username');
        });

        it('sets the password value into state', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordInput = queryByPlaceholderText('Your password') as HTMLInputElement;
            fireEvent.change(passwordInput, changeEvent('my-password'));
            expect(passwordInput).toHaveValue('my-password');
        });

        it('sets the password repeat value into state', () => {
            const {queryByPlaceholderText} = render(<UserSignupPage/>);
            const passwordRepeatInput = queryByPlaceholderText('Repeat your password') as HTMLInputElement;
            fireEvent.change(passwordRepeatInput, changeEvent('my-password'));
            expect(passwordRepeatInput).toHaveValue('my-password');
        });

        it('calls postSignup when the fields are valid and the actions are provided in props', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({actions});
            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        })

        it('does not throw exception when clicking the button when actions not provided in props', () => {
            setupForSubmit();
            expect(() => fireEvent.click(button)).not.toThrow();
        })

        it('calls post with user body when the fields are valid', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            }
            setupForSubmit({actions});
            fireEvent.click(button);
            const expectedUserObject = {
                username: 'my-username',
                displayName: 'my-display-name',
                password: 'P4ssword',
            }
            expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
        })

        it('does not allow user to click the Sign up button when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            }
            setupForSubmit({actions});
            fireEvent.click(button);
            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        })

        it('displays spinner when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayed(),
            };
            const {queryByTestId} = setupForSubmit({actions});
            fireEvent.click(button);

            const spinner = queryByTestId('spinner');
            expect(spinner).toBeInTheDocument();
        });

        it('hide spinner after api call finishes successfully', async () => {
            const actions = {
                postSignup: mockAsyncDelayed(),
            };
            const {queryByTestId} = setupForSubmit({actions});
            fireEvent.click(button);

            await waitFor(() => {
                const spinner = queryByTestId('spinner');
                expect(spinner).not.toBeInTheDocument();
            });
        });

        it('hide spinner after api call finishes with error', async () => {
            const actions = {
                postSignup: jest.fn().mockImplementation(() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject({
                                response: {data: {}}
                            });
                        }, 300)
                    })
                }),
            };
            const {queryByTestId} = setupForSubmit({actions});
            fireEvent.click(button);

            await waitFor(() => {
                const spinner = queryByTestId('spinner');
                expect(spinner).not.toBeInTheDocument();
            });
        });

        it('enables the signup button when password and repeat password have same value', () => {
            setupForSubmit();
            expect(button).not.toBeDisabled();
        })

        it('disables the signup button when password repeat does not match password', () => {
            setupForSubmit();
            fireEvent.change(repeatPasswordInput, changeEvent('new-pass'));
            expect(button).toBeDisabled();
        })

        it('disables the signup button when password does not match password repeat', () => {
            setupForSubmit();
            fireEvent.change(passwordInput, changeEvent('new-pass'));
            expect(button).toBeDisabled();
        })

        it('displays error style for password repeat input when password repeat mismatch', () => {
            const {queryByText} = setupForSubmit();
            fireEvent.change(repeatPasswordInput, changeEvent('new-pass'));
            const mismatchWarning = queryByText('Does not match to password');
            expect(mismatchWarning).toBeInTheDocument();
        })

        it('displays error style for password repeat input when password input mismatch', () => {
            const {queryByText} = setupForSubmit();
            fireEvent.change(passwordInput, changeEvent('new-pass'));
            const mismatchWarning = queryByText('Does not match to password');
            expect(mismatchWarning).toBeInTheDocument();
        })

        it('hides the validation error when user changes the content of displayName', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                displayName: 'Cannot be null',
                            },
                        },
                    },
                }),
            };
            const {findByText} = setupForSubmit({actions});
            fireEvent.click(button);

            const errorMessage = await findByText('Cannot be null');
            fireEvent.change(displayNameInput, changeEvent('name updated'));

            expect(errorMessage).not.toBeInTheDocument();
        });

        it('hides the validation error when user changes the content of username', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                username: 'Username cannot be null',
                            },
                        },
                    },
                }),
            };
            const {findByText} = setupForSubmit({actions});
            fireEvent.click(button);

            const errorMessage = await findByText('Username cannot be null');
            fireEvent.change(usernameInput, changeEvent('name updated'));

            expect(errorMessage).not.toBeInTheDocument();
        });

        it('hides the validation error when user changes the content of password', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                password: 'Cannot be null',
                            },
                        },
                    },
                }),
            };
            const {findByText} = setupForSubmit({actions});
            fireEvent.click(button);

            const errorMessage = await findByText('Cannot be null');
            fireEvent.change(passwordInput, changeEvent('updated-password'));

            expect(errorMessage).not.toBeInTheDocument();
        });

        it('redirects to homePage after successful signup', async () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValue({}),
            };
            const history = {
                push: jest.fn(),
            };
            const {queryByTestId} = setupForSubmit({actions, history});
            fireEvent.click(button);

            await waitForElementToBeRemoved(() => queryByTestId('spinner'));

            expect(history.push).toHaveBeenCalledWith('/');
        });

    });

});

console.error = () => {
}