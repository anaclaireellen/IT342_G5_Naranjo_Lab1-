import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Search,
  MessageSquare,
  UserPlus,
  X,
  MoreHorizontal,
  Smile,
  ChevronRight,
  User
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { fetchProfilesByUsernames } from '../utils/profileHelpers';

const AestheticChat = ({ colors, userName, initialRecipient = '' }) => {
  const [selected, setSelected] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [profileMap, setProfileMap] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const scrollRef = useRef(null);

  const buildContact = (name, preview = 'Start a conversation') => ({
    id: name,
    name,
    initial: name?.[0]?.toUpperCase() || '?',
    preview,
  });

  const loadProfiles = async (names) => {
    try {
      const nextProfiles = await fetchProfilesByUsernames(names);
      setProfileMap((current) => ({ ...current, ...nextProfiles }));
    } catch (error) {
      console.error('Could not load chat profiles', error);
    }
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('sender_username, receiver_username, content, created_at')
      .or(`sender_username.eq.${userName},receiver_username.eq.${userName}`)
      .order('created_at', { ascending: false });

    if (error) return;

    const seen = new Set();
    const nextContacts = [];

    (data || []).forEach((entry) => {
      const contactName = entry.sender_username === userName
        ? entry.receiver_username
        : entry.sender_username;

      if (!contactName || seen.has(contactName)) return;
      seen.add(contactName);
      nextContacts.push(buildContact(contactName, entry.content || 'Start a conversation'));
    });

    if (initialRecipient && initialRecipient !== userName && !seen.has(initialRecipient)) {
      nextContacts.unshift(buildContact(initialRecipient));
    }

    setContacts(nextContacts);
    loadProfiles(nextContacts.map((contact) => contact.name));
  };

  const fetchMessages = async (contactName) => {
    if (!contactName) {
      setMessages([]);
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_username.eq.${userName},receiver_username.eq.${contactName}),and(sender_username.eq.${contactName},receiver_username.eq.${userName})`)
      .order('created_at', { ascending: true });

    if (!error) {
      setMessages(data || []);
      loadProfiles([contactName, userName, ...(data || []).map((message) => message.sender_username)]);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [userName, initialRecipient]);

  useEffect(() => {
    if (!selected && initialRecipient && initialRecipient !== userName) {
      setSelected(buildContact(initialRecipient));
    }
  }, [initialRecipient, selected, userName]);

  useEffect(() => {
    fetchMessages(selected?.name);

    if (!selected?.name) return undefined;

    const channel = supabase
      .channel(`messages:${userName}:${selected.name}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages(selected.name);
        fetchContacts();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [selected?.name, userName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }

    setSearchResults(contacts.filter((contact) => contact.name.toLowerCase().includes(query)));
  }, [contacts, searchQuery]);

  const handleSend = async () => {
    if (!typedMessage.trim() || !selected) return;

    const { error } = await supabase.from('messages').insert([{
      content: typedMessage.trim(),
      sender_username: userName,
      receiver_username: selected.name,
    }]);

    if (!error) {
      setTypedMessage("");
      fetchMessages(selected.name);
      fetchContacts();
    }
  };

  const modernStyles = {
    container: {
      display: 'flex',
      height: '100%',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(246,250,255,0.92) 100%)',
      borderRadius: '32px',
      overflow: 'hidden',
      border: '1px solid rgba(226,232,240,0.9)',
      boxShadow: '0 26px 60px rgba(15, 23, 42, 0.08)',
      backdropFilter: 'blur(24px)'
    },
    sidebar: {
      width: '340px',
      background: 'rgba(250,252,255,0.9)',
      borderRight: '1px solid #E8EEF6',
      display: 'flex',
      flexDirection: 'column'
    },
    avatar: (bg) => ({
      width: '46px',
      height: '46px',
      borderRadius: '16px',
      background: bg || colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '700',
      overflow: 'hidden',
      boxShadow: '0 10px 18px rgba(15, 23, 42, 0.08)'
    }),
    inputWrapper: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.8)',
      borderRadius: '18px',
      padding: '0 15px',
      height: '52px',
      border: '1px solid #E2E8F0'
    },
    inputField: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: '14px',
      color: '#1E293B',
      padding: '0 10px'
    }
  };

  return (
    <div style={modernStyles.container}>
      <div style={modernStyles.sidebar}>
        <div style={{ padding: '28px 24px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8' }}>Direct messages</p>
              <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#0F172A' }}>Messages</h2>
            </div>
            <button onClick={() => setIsSearching(!isSearching)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors.primary }}>
              {isSearching ? <X size={18} /> : <UserPlus size={20} />}
            </button>
          </div>

          <div style={modernStyles.inputWrapper}>
            <Search size={16} color="#94A3B8" />
            <input
              placeholder={isSearching ? "Username..." : "Search..."}
              value={isSearching ? searchQuery : ""}
              onChange={(e) => isSearching && setSearchQuery(e.target.value)}
              style={modernStyles.inputField}
            />
          </div>

          {isSearching && searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: '126px', width: '292px', background: 'white', borderRadius: '16px', boxShadow: '0 20px 36px rgba(15,23,42,0.12)', zIndex: 10, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              {searchResults.map((contact) => (
                <div key={contact.id} onClick={() => { setSelected(contact); setIsSearching(false); }} style={{ padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #F8FAFC' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{contact.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {contacts.map((contact) => (
            <div key={contact.id} onClick={() => setSelected(contact)} style={{ padding: '14px 22px', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', background: selected?.name === contact.name ? 'rgba(226,232,240,0.5)' : 'transparent', borderLeft: selected?.name === contact.name ? `3px solid ${colors.primary}` : '3px solid transparent' }}>
              <div style={modernStyles.avatar(contact.name === 'Admin Office' ? colors.primary : colors.accent)}>
                {profileMap[contact.name]?.profilePic ? <img src={profileMap[contact.name].profilePic} alt={contact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : contact.initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{contact.name}</span>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.preview}</p>
              </div>
              <ChevronRight size={16} color="#CBD5E1" />
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selected ? (
          <>
            <header style={{ minHeight: '82px', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EDF2F7', background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(16px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={modernStyles.avatar(colors.primary)}>
                  {profileMap[selected.name]?.profilePic ? <img src={profileMap[selected.name].profilePic} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : selected.name[0]}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '18px', color: '#0F172A' }}>{selected.name}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>Direct conversation</p>
                </div>
              </div>
              <MoreHorizontal size={20} color="#94A3B8" />
            </header>

            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 26px', background: 'linear-gradient(180deg, #F8FBFF 0%, #F4F8FC 100%)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((message, i) => {
                const isMine = message.sender_username === userName;
                const senderPic = profileMap[message.sender_username]?.profilePic;

                return (
                  <div key={i} style={{ width: '100%', display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', maxWidth: '72%', flexDirection: isMine ? 'row-reverse' : 'row' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '12px', overflow: 'hidden', background: '#E2E8F0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {senderPic ? <img src={senderPic} alt={message.sender_username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={14} color="#475569" />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                        <span style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '6px', padding: '0 4px' }}>{message.sender_username}</span>
                        <div style={{
                          background: isMine ? 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 55%, #57C5B6 100%)' : 'rgba(255,255,255,0.9)',
                          color: isMine ? 'white' : '#1E293B',
                          padding: '12px 16px',
                          borderRadius: isMine ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
                          fontSize: '14px',
                          lineHeight: 1.55,
                          border: isMine ? 'none' : '1px solid #E2E8F0',
                          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.06)'
                        }}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #EDF2F7', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)' }}>
              <div style={modernStyles.inputWrapper}>
                <input
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Message..."
                  style={modernStyles.inputField}
                />
                <Smile size={18} color="#94A3B8" style={{ cursor: 'pointer' }} />
              </div>

              <button
                onClick={handleSend}
                style={{
                  background: 'linear-gradient(135deg, #0F4C81 0%, #1A5F7A 58%, #57C5B6 100%)',
                  color: 'white',
                  border: 'none',
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 16px 28px rgba(15,76,129,0.18)'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#94A3B8', background: 'linear-gradient(180deg, #F8FBFF 0%, #F4F8FC 100%)' }}>
            <div style={{ width: '84px', height: '84px', borderRadius: '28px', background: 'rgba(255,255,255,0.84)', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 30px rgba(15, 23, 42, 0.05)' }}>
              <MessageSquare size={38} />
            </div>
            <p style={{ marginTop: '16px', fontWeight: '700', fontSize: '18px', color: '#475569' }}>Select a chat</p>
            <p style={{ margin: '8px 0 0', maxWidth: '280px', textAlign: 'center', lineHeight: 1.6 }}>Pick someone from the left to continue the conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AestheticChat;
