import {fireEvent, queryByTestId, queryByText, render, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {UserList} from './UserList'
import * as apiCalls from '../api/apiCalls'

const setup = () => {
    return render(
        <MemoryRouter>
            <UserList />
        </MemoryRouter>
    );
};

const mockedEmptySuccessResponse = {
    data: {
        content: [],
        number: 0,
        size: 3,
    },
};

// jest.spyOn(apiCalls, 'listUsers')
//     .mockReturnValue(mockedEmptySuccessResponse));

// @ts-ignore
// apiCalls.listUsers = jest.fn().mockResolvedValue(mockedEmptySuccessResponse);

const mockSuccessGetSinglePage = {
    data: {
        content: [
            {
                username: 'user1',
                displayName: 'display1',
                image: '',
            },
            {
                username: 'user2',
                displayName: 'display2',
                image: '',
            },
            {
                username: 'user3',
                displayName: 'display3',
                image: '',
            },
        ],
        number: 0,
        first: true,
        last: true,
        size: 3,
        totalPages: 1,
    },
};

const mockSuccessGetMultiPageFirst = {
    data: {
        content: [
            {
                username: 'user1',
                displayName: 'display1',
                image: '',
            },
            {
                username: 'user2',
                displayName: 'display2',
                image: '',
            },
            {
                username: 'user3',
                displayName: 'display3',
                image: '',
            },
        ],
        number: 0,
        first: true,
        last: false,
        size: 3,
        totalPages: 2,
    },
};

const mockSuccessGetMultiPageLast = {
    data: {
        content: [
            {
                username: 'user4',
                displayName: 'display4',
                image: '',
            },
        ],
        number: 1,
        first: false,
        last: true,
        size: 3,
        totalPages: 2,
    },
};

const mockFailGet = {
    response: {
        data: {
            message: 'Load error',
        },
    },
};

describe('UserList', () => {

    describe('Layout', () => {

        it('has header of Users', () => {
            const { container } = setup();
            const header = container.querySelector('h3');
            expect(header).toHaveTextContent('Users');
        });

        it('displays three items when listUser api returns three users', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockSuccessGetSinglePage);
            const { queryByTestId } = setup();
            await waitFor(() => {
                const userGroup = queryByTestId('usergroup') as HTMLDivElement;
                expect(userGroup.childElementCount).toBe(3);
            })
        });

        it('displays the displayName@username when listUser api returns users', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockSuccessGetSinglePage);
            const { findByText } = setup();
            const firstUser = await findByText('display1@user1');
            expect(firstUser).toBeInTheDocument();
        });

        it('displays the next button when response has last value as false', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockSuccessGetMultiPageFirst);
            const { findByText } = setup();
            const nextLink = await findByText('next >');
            expect(nextLink).toBeInTheDocument();
        });

        it('hides the next button when response has last value as true', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockSuccessGetMultiPageLast);
            const { queryByText } = setup();
            await waitFor(() => {
                const nextLink = queryByText('next >');
                expect(nextLink).not.toBeInTheDocument();
            })
        });

        it('displays the previous button when response has first value as false', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockSuccessGetMultiPageLast);
            const { findByText } = setup();
            const previous = await findByText('< previous');
            expect(previous).toBeInTheDocument();
        });

        it('hides the previous button when response has first value as true', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockSuccessGetMultiPageFirst);
            const { queryByText } = setup();
            await waitFor(() => {
                const previous = queryByText('< previous');
                expect(previous).not.toBeInTheDocument();
            })
        });

        it('has link to UserPage', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockSuccessGetSinglePage);
            const { findByText, container } = setup();
            await findByText('display1@user1');
            const firstAnchor = container.querySelectorAll('a')[0];
            expect(firstAnchor.getAttribute('href')).toBe('/user1');
        });
    });

    describe('Lifecycle', () => {

        it('calls listUsers api when it is rendered', () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockedEmptySuccessResponse);
            setup();
            expect(apiCalls.listUsers).toHaveBeenCalledTimes(1);
        });

        it('calls listUsers method with page zero and size three', () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValue(mockedEmptySuccessResponse);
            setup();
            expect(apiCalls.listUsers).toHaveBeenCalledWith({ page: 0, size: 3 });
        });

    });

    describe('Interactions', () => {
        it('loads next page when clicked to next button', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValueOnce(mockSuccessGetMultiPageFirst)
                .mockResolvedValueOnce(mockSuccessGetMultiPageLast);
            const { findByText } = setup();
            const nextLink = await findByText('next >');
            fireEvent.click(nextLink);

            const secondPageUser = await findByText('display4@user4');

            expect(secondPageUser).toBeInTheDocument();
        });

        it('loads previous page when clicked to previous button', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValueOnce(mockSuccessGetMultiPageLast)
                .mockResolvedValueOnce(mockSuccessGetMultiPageFirst);
            const { findByText } = setup();
            const previousLink = await findByText('< previous');
            fireEvent.click(previousLink);

            const firstPageUser = await findByText('display1@user1');
            expect(firstPageUser).toBeInTheDocument();
        });

        it('displays error message when loading other page fails', async () => {
            jest.spyOn(apiCalls, 'listUsers')
                .mockResolvedValueOnce(mockSuccessGetMultiPageLast)
                .mockRejectedValue(mockFailGet);
            const { queryByText } = setup();
            await waitFor(() => {
                const previousLink = queryByText('< previous') as HTMLLinkElement;
                fireEvent.click(previousLink);
                const errorMessage = queryByText('User load failed');
                expect(errorMessage).toBeInTheDocument();
            });
        });

        it('hides error message when successfully loading other page', async () => {
                jest.spyOn(apiCalls, 'listUsers')
                    .mockResolvedValueOnce(mockSuccessGetMultiPageLast)
                    .mockRejectedValueOnce(mockFailGet)
                    .mockResolvedValueOnce(mockSuccessGetMultiPageFirst);
            const { queryByText } = setup();

            await waitFor(() => {
                const previousLink = queryByText('< previous') as HTMLLinkElement;
                fireEvent.click(previousLink);
                queryByText('User load failed');
                fireEvent.click(previousLink);
                const errorMessage = queryByText('User load failed');
                expect(errorMessage).not.toBeInTheDocument();
            });
        });
    });
});

console.error = () => {};