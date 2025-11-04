import React, { useState, useMemo } from 'react';

const MOCK_CHANNELS = [
    {
        id: 'news',
        title: 'Campus News Live',
        description: 'Your 24/7 source for the latest news, events, and announcements happening across Gemini University. Stay informed with live updates and special reports.',
        contentUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNDUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDM2OUExIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DQU1QVVMgTkVXUzwvdGV4dD48L3N2Zz4=`
    },
    {
        id: 'sports',
        title: 'Sports Highlights',
        description: 'Catch up on all the action from the Gemini Geckos! Replays, highlights, and analysis of every game.',
        contentUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNDUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDBBODQ3IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TUE9SVFMgSElHSExJR0hUUzwvdGV4dD48L3N2Zz4=`
    },
    {
        id: 'lectures',
        title: 'Guest Lecture Series',
        description: 'Watch insightful lectures from leading experts in technology, arts, and science. A new lecture premieres every week.',
        contentUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNDUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTgyRDUxIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5HVUVTVCBMRUNUVVJFUzwvdGV4dD48L3N2Zz4=`
    },
    {
        id: 'movies',
        title: 'Movie Night',
        description: 'Join us for a screening of classic and contemporary films. This week: "The Social Network".',
        contentUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNDUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjQjIzNzI5IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NT1ZJRSBOSUdBQjwvdGV4dD48L3N2Zz4=`
    },
    {
        id: 'nature',
        title: 'Planet Earth: Campus Wildlife',
        description: 'A stunning documentary showcasing the surprising biodiversity found right here on our university grounds.',
        contentUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNDUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDg5QTI4IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DQU1QVVMgV0lMRExJRkU8L3RleHQ+PC9zdmc+`
    }
];

const TVApp: React.FC = () => {
    const [currentChannelId, setCurrentChannelId] = useState(MOCK_CHANNELS[0].id);

    const currentChannel = useMemo(() => {
        return MOCK_CHANNELS.find(c => c.id === currentChannelId) || MOCK_CHANNELS[0];
    }, [currentChannelId]);

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col p-4 md:p-8">
                {/* Video Player */}
                <div className="w-full aspect-video bg-black rounded-lg shadow-lg flex items-center justify-center overflow-hidden mb-4">
                     <img src={currentChannel.contentUrl} alt={currentChannel.title} className="w-full h-full object-cover" />
                </div>

                {/* Info Panel */}
                <div className="animate-fade-in">
                    <h1 className="text-3xl font-bold">{currentChannel.title}</h1>
                    <p className="mt-2 text-gray-300 max-w-3xl">{currentChannel.description}</p>
                </div>
            </div>

            {/* Channel Guide */}
            <aside className="w-full md:w-72 bg-black/50 border-t md:border-t-0 md:border-l border-gray-700 flex-shrink-0">
                <h2 className="text-lg font-semibold p-4 border-b border-gray-700">Channel Guide</h2>
                <nav className="overflow-y-auto h-full max-h-40 md:max-h-full pb-4">
                    <ul>
                        {MOCK_CHANNELS.map((channel, index) => (
                            <li key={channel.id}>
                                <button
                                    onClick={() => setCurrentChannelId(channel.id)}
                                    className={`w-full text-left p-4 transition-colors duration-200 flex items-center gap-4 ${
                                        currentChannelId === channel.id
                                            ? 'bg-indigo-600'
                                            : 'hover:bg-gray-800'
                                    }`}
                                >
                                    <span className="text-gray-400 font-mono text-lg w-8">{String(index + 1).padStart(2, '0')}</span>
                                    <span className="font-semibold">{channel.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </div>
    );
};

export default TVApp;