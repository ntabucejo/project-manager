import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useEffect, useState } from 'react'
import Chatbox from '../../../../../components/chatbox'
import Header from '../../../../../components/header'
import Layout from '../../../../../components/layout'
import Main from '../../../../../components/main'
import type {
  IMember,
  IMessage,
  IProject,
  IUser,
} from '../../../../../library/schemas/interfaces'
import useClientStore from '../../../../../library/stores/client'
import objectified from '../../../../../library/utilities/objectified'
import prisma from '../../../../../library/utilities/prisma'
import Foundation from '../../../../../components/foundation'
import Icon from '../../../../../components/icon/icon'
import {
  CollectionIcon,
  FolderOpenIcon,
  LightBulbIcon,
  MenuAlt1Icon,
  MenuIcon,
  SpeakerphoneIcon,
} from '@heroicons/react/outline'
import Linker from '../../../../../components/link/link'
import SnowCard from '../../../../../components/card/snow-card'
import WhiteCard from '../../../../../components/card/white-card'
import IconLabel from '../../../../../components/icon/icon-with-label'
import Button from '../../../../../components/button/button'
import Task from '../../../../../components/task/task'
import CreateTaskModal from '../../../../../components/modals/create-task'
import ProjectCodeModal from '../../../../../components/modals/copy-code'
import phase from '../../../../../library/utilities/phase'
import Router, { useRouter } from 'next/router'
import Sidebar from '../../../../../components/sidebar/sidebar'

interface IProps {
  initialUser: IUser
  initialMember: IMember
  initialProject: IProject
  initialMessages: IMessage[]
}

const Dashboard: NextPage<IProps> = ({
  initialUser,
  initialMember,
  initialProject,
  initialMessages,
}) => {
  const user = useClientStore((state) => state.user)
  const member = useClientStore((state) => state.member)
  const project = useClientStore((state) => state.project)
  const deleteProject = useClientStore((state) => state.delete.project)
  const updateMembership = useClientStore(
    (state) => state.update.member?.active
  )
  const [ready, setReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenOption, setIsOpenOption] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [copyCode, setCopyCode] = useState(false)

  useEffect(() => {
    setReady(true)
    useClientStore.getState().read.user(initialUser)
    useClientStore.getState().read.member(initialMember)
    useClientStore.getState().read.project(initialProject)
    useClientStore.getState().read.messages(initialMessages)
  }, [initialUser, initialMember, initialProject, initialMessages])

  if (!ready) return <></>

  console.log('Dashboard Rendered')

  const handleLeaveProject = () => {
    member?.active === !member.active
  }

  return (
    <Foundation title="Dashboard">
      <Layout>
        <Header
          firstName={user.firstName[0].toUpperCase() + user.firstName.slice(1)}
          lastName={user.lastName[0].toUpperCase() + user.lastName.slice(1)}
        />
        <Main>
          <section>
            <div className="grid gap-5 relative">
              <button onClick={() => setIsOpen(!isOpen)}>
                <Icon icon={<MenuAlt1Icon />} />
              </button>

              {/* side bar */}
              {isOpen && <Sidebar userId={user.id} memberId={member.id} />}

              {/* project details */}
              <div className="grid">
                <WhiteCard>
                  <div className="grid gap-5">
                    {/* project name and option btn */}
                    <div className="grid grid-cols-[1fr,auto]">
                      <h1 className="md:font-lg font-semibold">
                        {project?.name}
                      </h1>
                      <button onClick={() => setIsOpenOption(!isOpenOption)}>
                        <Icon icon={<MenuIcon />} />
                      </button>

                      {isOpenOption && (
                        <div className="absolute top-11 right-7 bg-white shadow-md shadow-violet grid z-50">
                          {/* Edit Project */}
                          <Linker
                            name={'Edit Project'}
                            link={'#'}
                            style={
                              'py-4 px-8 hover:bg-snow transition-all duration-300'
                            }
                          />

                          {/* Copy */}
                          <button onClick={() => setCopyCode(!copyCode)}>
                            <Linker
                              name={'Copy Code'}
                              link={'#'}
                              style={
                                'py-4 px-8 hover:bg-snow transition-all duration-300'
                              }
                            />
                          </button>
                          {copyCode && (
                            <ProjectCodeModal
                              handler={() => setCopyCode(!copyCode)}
                              code={project?.code}
                            />
                          )}

                          {/* Delete Project */}
                          <button
                            onClick={() => {
                              deleteProject({ id: project?.id })
                              Router.push(`/connect/${user.id}`)
                            }}
                          >
                            <Linker
                              name={'Delete Project'}
                              link={'#'}
                              style={
                                'py-4 px-8 hover:bg-snow transition-all duration-300'
                              }
                            />
                          </button>

                          {/* Leave Project */}
                          <button
                            onClick={() => {
                              updateMembership({
                                id: member?.id,
                                key: 'active',
                                value: false,
                              })
                              Router.push(`/connect/${user.id}`)
                            }}
                          >
                            <Linker
                              name={'Leave Project'}
                              link={'#'}
                              style={
                                'py-4 px-8 hover:bg-snow transition-all duration-300'
                              }
                            />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* project description */}
                    <p className="leading-relaxed text-sm md:text-md font-light w-[90%]">
                      {project?.description}
                    </p>

                    {/* user's contribution and copy code */}
                    <div className="flex gap-10 items-center mb-28 lg:mb-16">
                      <IconLabel
                        icon={<CollectionIcon />}
                        label={project?.tasks?.length}
                      />
                      <IconLabel
                        icon={<FolderOpenIcon />}
                        label={project?.files?.length}
                      />
                      <IconLabel
                        icon={<SpeakerphoneIcon />}
                        label={project?.announcements?.length}
                      />
                      <IconLabel
                        icon={<LightBulbIcon />}
                        label={project?.suggestions?.length}
                      />
                    </div>
                  </div>
                  <SnowCard>
                    <div className="grid md:grid-cols-[1fr,auto] gap-2 md:gap-48 lg:gap-64 items-center">
                      {/* progress bar */}
                      <div>
                        <div className="grid grid-flow-col items-center">
                          <h1 className="text-xs text-gray-500">
                            Completeness
                          </h1>
                          <h1 className="text-xs text-gray-500 ml-auto">60%</h1>
                        </div>
                        <div className="relative w-full h-4 mt-1 border-[1px] border-gray-200 rounded-full">
                          <div className="absolute left-0 top-0 w-[60%] h-full bg-green-500 rounded-full"></div>
                        </div>
                      </div>

                      {/* start and due date */}
                      <div className="text-sm tracking-wide">
                        {String(phase(initialProject?.createdAt, 'LL'))} -{' '}
                        {String(phase(initialProject?.dueAt, 'LL'))}
                      </div>
                    </div>
                  </SnowCard>
                </WhiteCard>
              </div>

              {/* Project Tasks */}
              <div className="grid mt-5 gap-10">
                {/* tasks count and create task btn */}
                <div className="grid grid-cols-[1fr,auto] items-center">
                  <h1>
                    All (
                    <span className="font-bold">
                      {initialProject?.tasks?.length}
                    </span>
                    )
                  </h1>
                  <Button
                    name={'Create New Task'}
                    color={'blue'}
                    handler={() => setIsCreate(!isCreate)}
                  />
                  {isCreate && (
                    <CreateTaskModal handler={() => setIsCreate(!isCreate)} />
                  )}
                </div>
                {/* all users' project */}
                <div className="grid gap-3">
                  {project?.tasks?.map((task, index) => (
                    <Task task={task} index={index + 1} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Main>
        {/* <Chatbox /> */}
      </Layout>
    </Foundation>
  )
}

export default Dashboard

export const getStaticPaths: GetStaticPaths = async () => {
  const members = await prisma.member.findMany()

  const paths = members.map((member) => {
    return {
      params: { userId: member.userId, memberId: member.id },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const user = await prisma.user.findUnique({
    where: { id: String(params!.userId) },
    include: {
      members: {
        include: {
          _count: { select: { tasks: true } },
          project: {
            include: {
              _count: { select: { members: true, tasks: true } },
            },
          },
        },
      },
    },
  })

  const member = await prisma.member.findUnique({
    where: { id: String(params!.memberId) },
  })

  const project = await prisma.project.findUnique({
    where: { id: member?.projectId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      tasks: {
        include: {
          todos: true,
        },
      },
      suggestions: true,
      files: true,
      announcements: true,
    },
  })

  const messages = await prisma.message.findMany({
    where: { projectId: member!.projectId },
  })

  return {
    props: {
      initialUser: objectified(user),
      initialMember: objectified(member),
      initialProject: objectified(project),
      initialMessages: objectified(messages),
    },
    revalidate: 1,
  }
}
